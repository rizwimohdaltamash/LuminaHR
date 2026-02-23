import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useState } from "react";
import { FiCamera, FiUploadCloud, FiCheckCircle } from "react-icons/fi";

function PhotoResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { photo, emp } = location.state || {};
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    if (!photo) {
        return (
            <div style={styles.page}>
                <Navbar title="Photo Result" />
                <div style={styles.center}>
                    <p style={{ color: "rgba(0,0,0,0.5)" }}>
                        No photo found.{" "}
                        <button onClick={() => navigate("/list")} style={styles.btn}>
                            ← Go Back
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    const saveToFirestore = async () => {
        setSaving(true);
        try {
            // 1. Upload base64 string to Firebase Storage
            const filename = `photos/${emp?.id || 'unknown'}_${Date.now()}.png`;
            const storageRef = ref(storage, filename);
            await uploadString(storageRef, photo, 'data_url');

            // 2. Get the public download URL
            const downloadURL = await getDownloadURL(storageRef);

            // 3. Check if employee already has a photo document
            const q = query(collection(db, "photos"), where("employeeId", "==", emp?.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Update existing document
                const existingDocId = querySnapshot.docs[0].id;
                await updateDoc(doc(db, "photos", existingDocId), {
                    photoUrl: downloadURL,
                    timestamp: new Date().toISOString(),
                });
            } else {
                // Save new reference in Firestore
                await addDoc(collection(db, "photos"), {
                    employeeId: emp?.id,
                    employeeName: emp?.employee_name,
                    photoUrl: downloadURL,
                    timestamp: new Date().toISOString(),
                });
            }

            setSaved(true);
            setTimeout(() => {
                navigate("/gallery");
            }, 1000); // Navigate to gallery after 1 second
        } catch (err) {
            alert("Error saving to Firestore: " + err.message);
        }
        setSaving(false);
    };

    const downloadPhoto = () => {
        const link = document.createElement("a");
        link.href = photo;
        link.download = `${emp?.employee_name || "photo"}_capture.png`;
        link.click();
    };

    return (
        <div style={styles.page}>
            <Navbar title="Photo Result" />
            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={{ ...styles.title, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiCamera /> Captured Photo
                        </h2>
                        {emp && (
                            <p style={styles.subtitle}>
                                Employee: <strong style={{ color: "#1e293b" }}>{emp.employee_name}</strong>
                            </p>
                        )}
                    </div>

                    {/* Photo Display */}
                    <div style={styles.photoWrapper}>
                        <img src={photo} alt="Captured" style={styles.photo} />
                    </div>

                    {/* Actions */}
                    <div style={styles.actions}>
                        <button
                            onClick={downloadPhoto}
                            style={styles.downloadBtn}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.2)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
                        >
                            <FiUploadCloud style={{ transform: "rotate(180deg)" }} size={18} />
                            <span>Download Photo</span>
                        </button>

                        {!saved ? (
                            <button
                                onClick={saveToFirestore}
                                style={{
                                    ...styles.saveBtn,
                                    opacity: saving ? 0.7 : 1,
                                    cursor: saving ? "not-allowed" : "pointer"
                                }}
                                disabled={saving}
                                onMouseEnter={(e) => !saving && (e.currentTarget.style.opacity = 0.9)}
                                onMouseLeave={(e) => !saving && (e.currentTarget.style.opacity = 1)}
                            >
                                {saving ? "Saving..." : <><FiUploadCloud size={18} /> <span>Save</span></>}
                            </button>
                        ) : (
                            <div style={styles.savedBadge}>
                                <FiCheckCircle size={18} /> <span>Saved!</span>
                            </div>
                        )}
                    </div>

                    {emp && (
                        <div style={styles.empInfo}>
                            <div style={styles.empRow}>
                                <span style={styles.empLabel}>Name</span>
                                <span style={styles.empValue}>{emp.employee_name}</span>
                            </div>
                            <div style={styles.empRow}>
                                <span style={styles.empLabel}>Age</span>
                                <span style={styles.empValue}>{emp.employee_age} yrs</span>
                            </div>
                            <div style={styles.empRow}>
                                <span style={styles.empLabel}>Salary</span>
                                <span style={{ ...styles.empValue, color: "#10b981" }}>
                                    ${Number(emp.employee_salary).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
    },
    container: {
        maxWidth: "680px",
        margin: "0 auto",
        padding: "32px 24px",
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
    },
    btn: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.2)",
        color: "#059669",
        padding: "8px 16px",
        borderRadius: "8px",
        cursor: "pointer",
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
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    },
    cardHeader: {
        padding: "24px 28px 0",
    },
    title: {
        color: "#1e293b",
        fontSize: "22px",
        fontWeight: "700",
        margin: "0 0 6px 0",
    },
    subtitle: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "14px",
        margin: "0 0 20px 0",
    },
    photoWrapper: {
        margin: "0 28px 0",
        borderRadius: "12px",
        overflow: "hidden",
        border: "2px solid rgba(16,185,129,0.2)",
        boxShadow: "0 0 20px rgba(16,185,129,0.1)",
    },
    photo: {
        width: "100%",
        display: "block",
    },
    actions: {
        display: "flex",
        gap: "12px",
        padding: "20px 28px",
        alignItems: "center",
    },
    downloadBtn: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.2)",
        color: "#059669",
        padding: "12px 24px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flex: 1,
        transition: "background 0.2s",
    },
    saveBtn: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        border: "none",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flex: 1,
        transition: "opacity 0.2s",
    },
    savedBadge: {
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.3)",
        color: "#059669",
        padding: "12px 24px",
        borderRadius: "10px",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        flex: 1,
    },
    empInfo: {
        borderTop: "1px solid rgba(0,0,0,0.08)",
        padding: "20px 28px",
        background: "#f8fafc",
    },
    empRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
    },
    empLabel: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "13px",
    },
    empValue: {
        color: "#1e293b",
        fontSize: "13px",
        fontWeight: "500",
    },
};

export default PhotoResult;
