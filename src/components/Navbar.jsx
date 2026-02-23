import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiActivity, FiMenu, FiX } from "react-icons/fi";

function Navbar({ title = "LuminaHR" }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Employees", path: "/list" },
        { label: "Gallery", path: "/gallery" },
        { label: "Chart", path: "/chart" },
        { label: "Map", path: "/map" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigate = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <nav className="navbar" style={styles.nav}>
            <div style={styles.navTop}>
                <div style={styles.brand} onClick={() => handleNavigate("/list")}>
                    <div style={styles.logo}>
                        <FiActivity size={20} />
                    </div>
                    <span style={styles.brandName}>LuminaHR</span>
                </div>

                <div className="mobile-menu-btn" style={styles.hamburger} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <FiX size={24} color="#1e293b" /> : <FiMenu size={24} color="#1e293b" />}
                </div>
            </div>

            <span className="navbar-title" style={styles.pageTitle}>{title}</span>

            <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`} style={styles.links}>
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        className="navbar-link"
                        onClick={() => handleNavigate(item.path)}
                        style={{
                            ...styles.link,
                            ...(location.pathname === item.path ? styles.activeLink : {}),
                        }}
                    >
                        {item.label}
                    </button>
                ))}
                <button className="navbar-link logout" onClick={() => handleNavigate("/")} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 32px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 9999, // higher than leaflet 400
        fontFamily: "'Segoe UI', sans-serif",
    },
    navTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%", // critical for mobile top bar
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
    },
    logo: {
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
    },
    brandName: {
        color: "#1e293b",
        fontSize: "18px",
        fontWeight: "700",
    },
    pageTitle: {
        color: "rgba(0,0,0,0.5)",
        fontSize: "14px",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
    },
    hamburger: {
        display: "none", // hidden by default on desktop
        cursor: "pointer",
        padding: "4px",
    },
    links: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
    },
    link: {
        background: "transparent",
        border: "1px solid rgba(0,0,0,0.1)",
        color: "rgba(0,0,0,0.7)",
        padding: "7px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        transition: "all 0.2s",
    },
    activeLink: {
        background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.3)",
        color: "#059669",
    },
    logoutBtn: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "#ef4444",
        padding: "7px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
    },
};

export default Navbar;
