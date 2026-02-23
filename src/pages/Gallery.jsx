import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FiCamera, FiTrash2 } from "react-icons/fi";

function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "photos"));
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Sort by employeeId ascending (1, 2, 3...)
            data.sort((a, b) => Number(a.employeeId) - Number(b.employeeId));
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // prevent card click
        if (!window.confirm("Are you sure you want to delete this photo?")) return;

        try {
            await deleteDoc(doc(db, "photos", id));
            // Remove from UI
            setPhotos((prev) => prev.filter((photo) => photo.id !== id));
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Failed to delete photo.");
        }
    };

    return (
        <div style={styles.page}>
            <Navbar title="Employee Gallery" />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={{ ...styles.heading, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <FiCamera /> Employee Photo Gallery
                    </h2>
                    <p style={styles.subheading}>{photos.length} photos saved</p>
                </div>

                {loading ? (
                    <div style={styles.loader}>Loading gallery...</div>
                ) : photos.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No photos have been saved to Firestore yet.</p>
                        <p style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
                            Go to an employee's details page to capture and save a photo.
                        </p>
                    </div>
                ) : (
                    <div className="gallery-grid" style={styles.grid}>
                        {photos.map((item) => (
                            <div key={item.id} style={styles.card}>
                                <div style={styles.imgContainer}>
                                    <img src={item.photoUrl || item.photo} alt={item.employeeName} style={styles.img} />
                                </div>
                                <div style={styles.cardInfo}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={styles.empName}>{item.employeeName || "Unknown Employee"}</h3>
                                            <p style={styles.empId}>ID: #{item.employeeId}</p>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, item.id)}
                                            style={styles.deleteBtn}
                                            title="Delete Photo"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                    <p style={styles.date}>
                                        {new Date(item.timestamp).toLocaleDateString()} at{" "}
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 24px",
    },
    header: {
        marginBottom: "32px",
        textAlign: "center",
    },
    heading: {
        color: "#1e293b",
        fontSize: "28px",
        fontWeight: "700",
        margin: "0 0 8px 0",
    },
    subheading: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "15px",
        margin: 0,
    },
    loader: {
        textAlign: "center",
        padding: "60px",
        color: "rgba(0,0,0,0.5)",
    },
    emptyState: {
        textAlign: "center",
        padding: "80px 20px",
        background: "#fff",
        borderRadius: "16px",
        border: "1px dashed rgba(0,0,0,0.15)",
        color: "rgba(0,0,0,0.5)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
    },
    imgContainer: {
        width: "100%",
        height: "220px",
        backgroundColor: "#e2e8f0",
        overflow: "hidden",
        position: "relative",
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    cardInfo: {
        padding: "16px 20px",
    },
    empName: {
        color: "#1e293b",
        fontSize: "16px",
        fontWeight: "600",
        margin: "0 0 4px 0",
    },
    empId: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "13px",
        margin: "0 0 12px 0",
    },
    date: {
        color: "#10b981",
        fontSize: "12px",
        fontWeight: "500",
        margin: 0,
    },
    deleteBtn: {
        background: "rgba(239,68,68,0.1)",
        border: "none",
        color: "#ef4444",
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
    },
};

// Add hover styles globally or inline if complex, simple hover using transparency is usually enough but pseudo class is nice.
// We'll rely on the default button click transition.

export default Gallery;
