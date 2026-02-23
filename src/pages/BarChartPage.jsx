import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchDummyEmployees } from "../dummyData";
import { FiBarChart2 } from "react-icons/fi";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChartPage() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDummyEmployees()
            .then((json) => {
                if (json.status === "success") setEmployees(json.data.slice(0, 10));
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const top = employees.slice(0, 10);

    const chartData = {
        labels: top.map((e) => e.employee_name?.split(" ")[0]),
        datasets: [
            {
                label: "Annual Salary ($)",
                data: top.map((e) => Number(e.employee_salary)),
                backgroundColor: top.map((_, i) =>
                    `hsla(${150 + i * 5}, 80 %, 45 %, 0.8)`
                ),
                borderColor: top.map((_, i) =>
                    `hsla(${150 + i * 5}, 80 %, 35 %, 1)`
                ),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: "#475569", font: { size: 13 } },
            },
            title: {
                display: true,
                text: "Top 10 Employee Salaries",
                color: "#1e293b",
                font: { size: 18, weight: "bold" },
                padding: { bottom: 20 },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => ` $${ctx.raw.toLocaleString()} `,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "#64748b" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                ticks: {
                    color: "#64748b",
                    callback: (v) => "$" + v.toLocaleString(),
                },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
    };

    const totalSalary = top.reduce((s, e) => s + Number(e.employee_salary), 0);
    const avgSalary = top.length ? Math.round(totalSalary / top.length) : 0;
    const maxEmp = top.reduce((a, b) => (Number(a.employee_salary) > Number(b.employee_salary) ? a : b), top[0] || {});

    return (
        <div style={styles.page}>
            <Navbar title="Salary Chart" />
            <div style={styles.container}>
                <div style={styles.header}>
                    <button style={styles.backBtn} onClick={() => navigate("/list")}>
                        ← Back to List
                    </button>
                    <h2 style={{ ...styles.heading, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiBarChart2 /> Salary Analytics
                    </h2>
                </div>
                {/* Stats Cards */}
                <div className="stats-row" style={styles.statsRow}>
                    <StatCard label="Total Payroll" value={`$${totalSalary.toLocaleString()} `} color="#10b981" />
                    <StatCard label="Average Salary" value={`$${avgSalary.toLocaleString()} `} color="#059669" />
                    <StatCard label="Highest Paid" value={maxEmp?.employee_name?.split(" ")[0] || "—"} color="#ea580c" />
                </div>

                {/* Chart */}
                <div className="chart-card" style={styles.chartCard}>
                    {loading ? (
                        <div style={styles.loader}>Loading chart data...</div>
                    ) : (
                        <div style={{ height: "420px" }}>
                            <Bar data={chartData} options={options} />
                        </div>
                    )}
                </div>

                {/* Table */}
                {!loading && (
                    <div className="chart-table" style={styles.tableCard}>
                        <h3 style={styles.tableTitle}>Salary Breakdown</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Employee</th>
                                    <th style={styles.th}>Age</th>
                                    <th style={styles.th}>Salary</th>
                                    <th style={styles.th}>% of Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top.map((emp) => {
                                    const pct = totalSalary ? ((emp.employee_salary / totalSalary) * 100).toFixed(1) : 0;
                                    return (
                                        <tr key={emp.id}>
                                            <td style={styles.td}>{emp.employee_name}</td>
                                            <td style={styles.td}>{emp.employee_age}</td>
                                            <td style={{ ...styles.td, color: "#10b981", fontWeight: "600" }}>${Number(emp.employee_salary).toLocaleString()}</td>
                                            <td style={styles.td}>
                                                <div style={styles.barBg}>
                                                    <div style={{ ...styles.barFill, width: `${pct}% ` }} />
                                                </div>
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>{pct}%</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div style={{ ...cardS.card, borderColor: color + "33" }}>
            <p style={cardS.label}>{label}</p>
            <p style={{ ...cardS.value, color }}>{value}</p>
        </div>
    );
}

const cardS = {
    card: {
        flex: 1,
        background: "#fff",
        border: "1px solid",
        borderRadius: "14px",
        padding: "20px 24px",
        minWidth: "140px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    label: { color: "rgba(0,0,0,0.5)", fontSize: "12px", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" },
    value: { fontSize: "22px", fontWeight: "700", margin: 0 },
};

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
    heading: { color: "#1e293b", fontSize: "26px", fontWeight: "700", marginBottom: "20px", marginTop: 0 },
    statsRow: { display: "flex", gap: "14px", marginBottom: "20px", flexWrap: "wrap" },
    chartCard: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        padding: "28px",
        marginBottom: "20px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    loader: { color: "rgba(0,0,0,0.5)", textAlign: "center", padding: "40px" },
    tableCard: {
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    },
    tableTitle: { color: "#1e293b", fontSize: "16px", fontWeight: "600", padding: "20px 20px 12px", margin: 0 },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "10px 20px",
        textAlign: "left",
        color: "rgba(0,0,0,0.5)",
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "#f8fafc",
    },
    td: { padding: "12px 20px", color: "#475569", fontSize: "13px", borderBottom: "1px solid rgba(0,0,0,0.04)" },
    barBg: { height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", marginBottom: "4px", overflow: "hidden" },
    barFill: { height: "100%", background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "3px" },
};

export default BarChartPage;
