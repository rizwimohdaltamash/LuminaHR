import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiGift, FiDollarSign, FiCalendar, FiImage, FiCamera, FiX } from "react-icons/fi";

function Details() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [emp, setEmp] = useState(location.state?.emp || null);
    const [cameraActive, setCameraActive] = useState(false);
    const [stream, setStream] = useState(null);
    const [savedPhoto, setSavedPhoto] = useState(null);

    const fetchSavedPhoto = async (employeeId) => {
        try {
            // Check for both number and string IDs to be safe
            const numQuery = query(collection(db, "photos"), where("employeeId", "==", Number(employeeId)));
            const strQuery = query(collection(db, "photos"), where("employeeId", "==", String(employeeId)));

            const [numSnap, strSnap] = await Promise.all([getDocs(numQuery), getDocs(strQuery)]);

            const docs = [...numSnap.docs, ...strSnap.docs];

            if (docs.length > 0) {
                // Determine the most recent photo
                const sorted = docs.map(doc => doc.data()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                const latestPhoto = sorted[0].photoUrl || sorted[0].photo;
                setSavedPhoto(latestPhoto);
            }
        } catch (err) {
            console.error("Error fetching saved photo:", err);
        }
    };

    useEffect(() => {
        // Cleanup camera on unmount
        return () => {
            if (stream) stream.getTracks().forEach((t) => t.stop());
        };
    }, [stream]);

    useEffect(() => {
        // Load employee data from localStorage if not passed via location state
        if (!emp) {
            const localData = JSON.parse(localStorage.getItem("dummy_employees")) || [];
            const found = localData.find((e) => e.id.toString() === id);
            setEmp(found);
        }

        // Fetch saved photo for this user
        fetchSavedPhoto(id);
    }, [id, emp]); // Added emp to dependency array to avoid infinite loop if emp is null initially

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setCameraActive(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            alert("Camera access denied or not available: " + err.message);
        }
    };

    const stopCamera = () => {
        if (stream) stream.getTracks().forEach((t) => t.stop());
        setStream(null);
        setCameraActive(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
        const photo = canvas.toDataURL("image/png");

        stopCamera();
        navigate("/photo", { state: { photo, emp } });
    };

    const savePhotoToFirestore = async (photo) => {
        try {
            await addDoc(collection(db, "photos"), {
                employeeId: id,
                employeeName: emp?.employee_name,
                photo,
                timestamp: new Date().toISOString(),
            });
            setPhotoSaved(true);
        } catch (err) {
            console.error("Firestore save error:", err);
        }
    };

    if (!emp) {
        return (
            <div style={styles.page}>
                <Navbar title="Employee Details" />
                <div style={styles.center}>
                    <p style={{ color: "rgba(0,0,0,0.5)" }}>No employee data. <button onClick={() => navigate("/list")} style={styles.backBtn}>← Go Back</button></p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <Navbar title="Employee Details" />
            <div style={styles.container}>
                <button onClick={() => navigate("/list")} style={styles.backBtn}>← Back to List</button>

                <div style={styles.card}>
                    {/* Avatar Section */}
                    <div style={styles.avatarSection}>
                        <div style={styles.bigAvatar}>{emp.employee_name?.charAt(0)}</div>
                        <h2 style={styles.empName}>{emp.employee_name}</h2>
                        <p style={styles.empId}>Employee ID: #{emp.id}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="details-grid" style={styles.grid}>
                        <DetailCard label="Age" value={`${emp.employee_age} years`} icon={<FiGift />} />
                        <DetailCard label="Annual Salary" value={`$${Number(emp.employee_salary).toLocaleString()}`} icon={<FiDollarSign />} />
                        <DetailCard label="Monthly Salary" value={`$${Math.round(emp.employee_salary / 12).toLocaleString()}`} icon={<FiCalendar />} />
                        <DetailCard
                            label="Profile Image"
                            value={savedPhoto ? (
                                <a href={savedPhoto} target="_blank" rel="noopener noreferrer" style={{ color: "#10b981", textDecoration: "none" }}>
                                    View Saved Photo ↗
                                </a>
                            ) : emp.profile_image || "Not provided"}
                            icon={<FiImage />}
                        />
                    </div>

                    {/* Camera Section */}
                    <div style={styles.cameraSection}>
                        <h3 style={styles.sectionTitle}><FiCamera /> Capture Photo</h3>

                        {!cameraActive ? (
                            <button onClick={startCamera} style={styles.cameraBtn}>
                                Start Camera
                            </button>
                        ) : (
                            <div>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={styles.video}
                                />
                                <canvas ref={canvasRef} style={{ display: "none" }} />
                                <div className="camera-actions" style={styles.cameraActions}>
                                    <button onClick={capturePhoto} style={styles.captureBtn}>
                                        <FiCamera size={18} /> <span>Capture Photo</span>
                                    </button>
                                    <button onClick={stopCamera} style={styles.cancelCamBtn}>
                                        <FiX size={18} /> <span>Cancel</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon }) {
    return (
        <div style={cardStyles.card}>
            <span style={cardStyles.icon}>{icon}</span>
            <div>
                <p style={cardStyles.label}>{label}</p>
                <p style={cardStyles.value}>{value}</p>
            </div>
        </div>
    );
}

const cardStyles = {
    card: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "18px 20px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    icon: { fontSize: "24px" },
    label: { color: "rgba(0,0,0,0.5)", fontSize: "12px", margin: 0 },
    value: { color: "#1e293b", fontSize: "16px", fontWeight: "600", margin: "4px 0 0 0" },
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
    },
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "32px 24px",
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
    },
    backBtn: {
        background: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.1)",
        color: "rgba(0,0,0,0.6)",
        padding: "8px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        marginBottom: "24px",
        display: "inline-block",
    },
    card: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    },
    avatarSection: {
        background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1))",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "40px 24px",
        textAlign: "center",
    },
    bigAvatar: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        fontWeight: "bold",
        margin: "0 auto 16px",
        boxShadow: "0 0 30px rgba(16,185,129,0.4)",
    },
    empName: {
        color: "#1e293b",
        fontSize: "24px",
        fontWeight: "700",
        margin: "0 0 6px 0",
    },
    empId: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "13px",
        margin: 0,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        padding: "24px",
    },
    cameraSection: {
        borderTop: "1px solid rgba(0,0,0,0.08)",
        padding: "24px",
        background: "#f8fafc",
    },
    sectionTitle: {
        color: "#1e293b",
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "16px",
        marginTop: 0,
    },
    cameraBtn: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        border: "none",
        color: "#fff",
        padding: "12px 28px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
    },
    video: {
        width: "100%",
        borderRadius: "12px",
        background: "#000",
        maxHeight: "320px",
        objectFit: "cover",
    },
    cameraActions: {
        display: "flex",
        gap: "12px",
        marginTop: "16px",
    },
    captureBtn: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        border: "none",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "opacity 0.2s",
    },
    cancelCamBtn: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#ef4444",
        padding: "12px 24px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        transition: "background 0.2s",
    },
};

export default Details;
