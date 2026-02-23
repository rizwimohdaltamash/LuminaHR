import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiActivity } from "react-icons/fi";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (username === "testuser" && password === "Test123") {
            navigate("/list");
        } else {
            setError("Invalid Credentials. Use testuser / Test123");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Logo / Brand */}
                <div style={styles.brand}>
                    <div style={styles.logo}>
                        <FiActivity size={24} />
                    </div>
                    <h1 style={styles.brandName}>LuminaHR</h1>
                </div>

                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Sign in to access your dashboard</p>

                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input
                        style={styles.input}
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        style={styles.input}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                </div>

                <button onClick={handleLogin} style={styles.button}>
                    Login →
                </button>

                <p style={styles.hint}>Hint: testuser / Test123</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "20px",
        padding: "48px 40px",
        width: "420px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "28px",
        justifyContent: "center",
    },
    logo: {
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "bold",
    },
    brandName: {
        color: "#1e293b",
        fontSize: "24px",
        fontWeight: "700",
        margin: 0,
    },
    title: {
        color: "#0f172a",
        fontSize: "22px",
        fontWeight: "600",
        margin: "0 0 6px 0",
        textAlign: "center",
    },
    subtitle: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "14px",
        textAlign: "center",
        margin: "0 0 28px 0",
    },
    errorBox: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#ef4444",
        borderRadius: "10px",
        padding: "12px",
        fontSize: "13px",
        marginBottom: "16px",
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: "16px",
    },
    label: {
        display: "block",
        color: "rgba(0,0,0,0.7)",
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "6px",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "10px",
        color: "#1e293b",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        transition: "border 0.2s",
    },
    button: {
        width: "100%",
        padding: "13px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "6px",
        letterSpacing: "0.3px",
        transition: "opacity 0.2s",
    },
    hint: {
        color: "rgba(0,0,0,0.4)",
        fontSize: "12px",
        textAlign: "center",
        marginTop: "16px",
    },
};

export default Login;
