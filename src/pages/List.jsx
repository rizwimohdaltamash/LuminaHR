import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiSearch, FiMonitor, FiMapPin, FiMap } from "react-icons/fi";
import { fetchDummyEmployees } from "../dummyData";

function List() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [savedToFirestore, setSavedToFirestore] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const json = await fetchDummyEmployees();
            if (json.status === "success") {
                setEmployees(json.data.slice(0, 10)); // Keep only first 10
            }
        } catch (err) {
            // Fallback: load from Firestore if API fails
            try {
                const snapshot = await getDocs(collection(db, "employees"));
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                if (data.length > 0) setEmployees(data);
            } catch (e) {
                console.error("Both API and Firestore failed:", e);
            }
        }
        setLoading(false);
    };

    const filteredEmployees = employees.filter(
        (e) =>
            e.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
            e.employee_age?.toString().includes(search)
    );

    return (
        <div style={styles.page}>
            <Navbar title="Employee List" />
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerInfo}>
                        <h2 style={styles.heading}>Employees</h2>
                        <p style={styles.subheading}>{employees.length} records</p>
                    </div>
                </div>

                {/* Search */}
                <div style={styles.searchWrapper}>
                    <FiSearch style={styles.searchIcon} />
                    <input
                        style={styles.searchInput}
                        placeholder="Search by name or age..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                {loading ? (
                    <div style={styles.loader}>
                        <div style={styles.spinner}></div>
                        <p style={{ color: "rgba(0,0,0,0.5)", marginTop: "16px" }}>Loading employees...</p>
                    </div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>#</th>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Salary</th>
                                    <th style={styles.th}>Age</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((emp, i) => (
                                    <tr
                                        key={emp.id}
                                        style={styles.tr}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.08)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={styles.td}>{i + 1}</td>
                                        <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                                            <div style={styles.avatar}>{emp.employee_name?.charAt(0)}</div>
                                            {emp.employee_name}
                                        </td>
                                        <td style={styles.td}>{emp.employee_age} yrs</td>
                                        <td style={{ ...styles.td, color: "#10b981", fontWeight: "600" }}>
                                            ${Number(emp.employee_salary).toLocaleString()}
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => navigate(`/details/${emp.id}`, { state: { emp } })}
                                                style={styles.viewBtn}
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap",
        gap: "12px",
    },
    heading: {
        color: "#1e293b",
        fontSize: "26px",
        fontWeight: "700",
        margin: 0,
    },
    subheading: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "13px",
        margin: "4px 0 0 0",
    },
    headerActions: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
    },
    actionBtn: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.3)",
        color: "#059669",
        padding: "9px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
    },
    mapBtn: {
        background: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.35)",
        color: "#059669",
        padding: "9px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
    },
    fireBtn: {
        background: "rgba(251,146,60,0.1)",
        border: "1px solid rgba(251,146,60,0.3)",
        color: "#ea580c",
        padding: "9px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
    },
    successBanner: {
        background: "rgba(16,185,129,0.12)",
        border: "1px solid rgba(16,185,129,0.3)",
        color: "#059669",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "16px",
        fontSize: "14px",
    },
    searchWrapper: {
        position: "relative",
        marginBottom: "20px",
    },
    searchIcon: {
        position: "absolute",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "rgba(0,0,0,0.4)",
        fontSize: "16px",
    },
    searchInput: {
        width: "100%",
        padding: "12px 18px 12px 42px",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "12px",
        color: "#1e293b",
        fontSize: "14px",
        boxSizing: "border-box",
        outline: "none",
    },
    tableWrapper: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        overflowX: "auto",
        overflowY: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "14px 20px",
        textAlign: "left",
        color: "rgba(0,0,0,0.5)",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#f8fafc",
    },
    tr: {
        cursor: "pointer",
        transition: "background 0.15s",
    },
    td: {
        padding: "14px 20px",
        color: "#475569",
        fontSize: "14px",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
        display: "table-cell",
        verticalAlign: "middle",
    },
    avatar: {
        display: "inline-flex",
        width: "30px",
        height: "30px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "13px",
        marginRight: "10px",
        verticalAlign: "middle",
    },
    viewBtn: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.2)",
        color: "#059669",
        padding: "6px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
    },
    loader: {
        textAlign: "center",
        padding: "60px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "3px solid rgba(16,185,129,0.2)",
        borderTop: "3px solid #10b981",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
};

export default List;
