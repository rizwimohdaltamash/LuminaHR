import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import { fetchDummyEmployees } from "../dummyData";
import { FiMap, FiMapPin, FiDollarSign, FiGift } from "react-icons/fi";
import L from "leaflet";

// Fix Leaflet's default icon path issue with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Sample Indian city locations for employees
const indianCities = [
    { city: "Mumbai", lat: 19.076, lng: 72.8777 },
    { city: "Delhi", lat: 28.7041, lng: 77.1025 },
    { city: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { city: "Hyderabad", lat: 17.385, lng: 78.4867 },
    { city: "Chennai", lat: 13.0827, lng: 80.2707 },
    { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
    { city: "Pune", lat: 18.5204, lng: 73.8567 },
    { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
    { city: "Lucknow", lat: 26.8467, lng: 80.9462 },
    { city: "Surat", lat: 21.1702, lng: 72.8311 },
    { city: "Chandigarh", lat: 30.7333, lng: 76.7794 },
    { city: "Kochi", lat: 9.9312, lng: 76.2673 },
    { city: "Bhopal", lat: 23.2599, lng: 77.4126 },
    { city: "Nagpur", lat: 21.1458, lng: 79.0882 },
    { city: "Indore", lat: 22.7196, lng: 75.8577 },
    { city: "Patna", lat: 25.5941, lng: 85.1376 },
    { city: "Vadodara", lat: 22.3072, lng: 73.1812 },
    { city: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    { city: "Noida", lat: 28.5355, lng: 77.391 },
    { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
    { city: "Mysore", lat: 12.2958, lng: 76.6394 },
    { city: "Agra", lat: 27.1767, lng: 78.0081 },
    { city: "Gwalior", lat: 26.2183, lng: 78.1828 },
];

function MapPage() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDummyEmployees()
            .then((json) => {
                if (json.status === "success") setEmployees(json.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    // Assign cities to employees
    const markers = employees.map((emp, i) => ({
        ...emp,
        ...indianCities[i % indianCities.length],
    }));

    return (
        <div style={styles.page}>
            <Navbar title="Map View" />
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate("/list")}>
                        ← Back to List
                    </button>
                    <h2 style={{ ...styles.heading, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiMap /> Employee Location Map
                    </h2>
                    <p style={styles.subheading}>
                        Showing {employees.length} employees across India
                    </p>
                </div>

                {loading ? (
                    <div style={styles.loader}>Loading map data...</div>
                ) : (
                    <div style={styles.mapWrapper}>
                        <MapContainer
                            center={[20.5937, 78.9629]}
                            zoom={5}
                            style={{ width: "100%", height: "500px", borderRadius: "16px" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {markers.map((emp) => (
                                <CircleMarker key={emp.id} center={[emp.lat, emp.lng]} radius={8} color="#10b981" fillOpacity={0.7}>
                                    <Popup>
                                        <div style={styles.popupDetails}>
                                            <strong>{emp.employee_name}</strong>
                                            <p style={styles.popupText}>
                                                <FiMapPin /> {emp.city}
                                            </p>
                                            <p style={{ ...styles.popupText, color: "#10b981", fontWeight: "600" }}>
                                                <FiDollarSign /> {Number(emp.employee_salary).toLocaleString()}
                                            </p>
                                            <p style={styles.popupText}>
                                                <FiGift /> {emp.employee_age} years
                                            </p>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                )}

                {/* Legend/Employees mini-list */}
                {!loading && (
                    <div style={styles.legendCard}>
                        <h3 style={styles.legendTitle}>Employee Locations</h3>
                        <div style={styles.legendGrid}>
                            {markers.slice(0, 12).map((emp) => (
                                <div key={emp.id} style={styles.legendItem}>
                                    <div style={styles.dot} />
                                    <div>
                                        <p style={styles.legendName}>{emp.employee_name}</p>
                                        <p style={styles.legendCity}>
                                            <FiMapPin /> {emp.city}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
    container: { maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" },
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
    header: { marginBottom: "20px" },
    heading: { color: "#1e293b", fontSize: "26px", fontWeight: "700", margin: "0 0 6px 0" },
    subheading: { color: "rgba(0,0,0,0.5)", fontSize: "14px", margin: 0 },
    mapWrapper: {
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        marginBottom: "20px",
    },
    loader: { color: "rgba(0,0,0,0.5)", textAlign: "center", padding: "60px" },
    legendCard: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        padding: "20px 24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    legendTitle: { color: "#1e293b", fontSize: "15px", fontWeight: "600", margin: "0 0 16px 0" },
    legendGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#f8fafc",
        border: "1px solid rgba(0,0,0,0.05)",
        borderRadius: "8px",
        padding: "10px 12px",
    },
    dot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #10b981, #059669)",
        flexShrink: 0,
    },
    legendName: { color: "#1e293b", fontSize: "12px", fontWeight: "600", margin: 0 },
    legendCity: { color: "rgba(0,0,0,0.5)", fontSize: "11px", margin: "2px 0 0 0" },
};

export default MapPage;
