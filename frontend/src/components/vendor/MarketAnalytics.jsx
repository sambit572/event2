import React, { useEffect, useRef, useState } from "react";

/* ── Google Fonts ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
document.head.appendChild(fontLink);

/* ── Global Styles ── */
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  * { box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; margin: 0; }
  :root {
    --bg: #f1f5f9;
    --card: #ffffff;
    --border: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --navy: #1e3a5f;
    --blue: #3b82f6;
    --violet: #7c3aed;
    --amber: #f59e0b;
    --green: #16a34a;
    --red: #ef4444;
    --orange: #f97316;
  }
  .kpi-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
  .btn-primary { transition: background 0.15s ease, transform 0.1s ease; }
  .btn-primary:hover { background: #162d4a !important; transform: scale(1.02); }
  .btn-primary:active { transform: scale(0.98); }
  .tip-row { transition: background 0.15s ease; border-radius: 8px; padding: 4px 6px; }
  .tip-row:hover { background: rgba(0,0,0,0.04); }
`;
document.head.appendChild(globalStyle);

/* ── Chart.js Loader ── */
function useChartJs(callback, deps = []) {
  useEffect(() => {
    if (window.Chart) { callback(window.Chart); return; }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js";
    script.onload = () => callback(window.Chart);
    document.head.appendChild(script);
  }, deps);
}

/* ── Reusable Card ── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 20,
      boxShadow: "0 1px 6px rgba(0,0,0,0.06)", ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Section Title ── */
function SectionTitle({ children, style = {} }) {
  return (
    <h2 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.01em", ...style }}>
      {children}
    </h2>
  );
}

/* ── Insight Box ── */
function InsightBox({ text, color = "#fef3c7", border = "#fde68a", textColor = "#78350f", icon = "💡", style = {} }) {
  return (
    <div style={{
      background: color, border: `1px solid ${border}`,
      borderRadius: 10, padding: "11px 14px",
      display: "flex", gap: 8, alignItems: "flex-start",
      marginTop: 12, ...style,
    }}>
      <span style={{ fontSize: 15, lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
      <p style={{ margin: 0, fontSize: 12.5, color: textColor, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
    </div>
  );
}

/* ── KPI Card ── */
function KpiCard({ icon, label, value, sub, subColor = "#16a34a", bg = "#fffbeb", border = "#fed7aa" }) {
  return (
    <div className="kpi-card" style={{
      background: bg, border: `1px solid ${border}`,
      borderRadius: 14, padding: "14px 16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 17 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'DM Mono', monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: subColor, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── Market Trends Line Chart ── */
function MarketTrendsChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useChartJs((Chart) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Average Market Listed Price",
            data: [32000,33000,31000,34000,35000,36000,37000,38000,37500,39000,40000,41000],
            borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.08)",
            fill: true, tension: 0.45, pointRadius: 3.5, pointBackgroundColor: "#3b82f6",
            pointHoverRadius: 6, borderWidth: 2.2,
          },
          {
            label: "Average Market Bookings Price",
            data: [30000,31000,29000,32000,33000,34000,35000,36000,35500,37000,38000,39000],
            borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.06)",
            fill: true, tension: 0.45, pointRadius: 3.5, pointBackgroundColor: "#ef4444",
            pointHoverRadius: 6, borderWidth: 2.2,
          },
          {
            label: "My Average Booking Price",
            data: [27000,28500,27000,29000,30000,31000,31500,32500,32000,33000,34000,35000],
            borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.07)",
            fill: true, tension: 0.45, pointRadius: 3.5, pointBackgroundColor: "#f59e0b",
            pointHoverRadius: 6, borderWidth: 2.2, borderDash: [5, 4],
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top", labels: { font: { size: 10.5, family: "'DM Sans'" }, boxWidth: 10, padding: 12 } },
          tooltip: {
            backgroundColor: "#0f172a", titleFont: { family: "'DM Sans'", size: 11 },
            bodyFont: { family: "'DM Mono'", size: 11 }, padding: 10, cornerRadius: 8,
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString("en-IN")}` },
          },
        },
        scales: {
          y: {
            min: 0, max: 45000,
            ticks: { callback: (v) => v === 0 ? "0" : `${(v/1000).toFixed(0)}K`, font: { size: 10 }, color: "#94a3b8" },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#94a3b8" } },
        },
      },
    });
  });
  return <div style={{ height: 220 }}><canvas ref={canvasRef} /></div>;
}

/* ── Booking Distribution Pie ── */
function BookingDistributionChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const segments = [
    { label: "Local Festivals", value: 26, color: "#FF0000" },
    { label: "Wedding", value: 33.2, color: "#a78bfa" },
    { label: "Navratri", value: 8.5, color: "#fbbf24" },
    // { label: "Re-Bookings", value: 7.2, color: "#c4b5fd" },
  ];
  useChartJs((Chart) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: segments.map(s => s.label),
        datasets: [{ data: segments.map(s => s.value), backgroundColor: segments.map(s => s.color), borderWidth: 2.5, borderColor: "#fff", hoverOffset: 8 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "52%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a", titleFont: { family: "'DM Sans'", size: 11 },
            bodyFont: { family: "'DM Mono'", size: 11 }, padding: 10, cornerRadius: 8,
            callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` },
          },
        },
      },
    });
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
      <div style={{ width: 145, height: 145, flexShrink: 0 }}>
        <canvas ref={canvasRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.color, flexShrink: 0, boxShadow: `0 0 0 2px ${s.color}33` }} />
            <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", paddingLeft: 10, fontFamily: "'DM Mono'" }}>{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Improve Conversion Card ── */
function ImproveConversionCard() {
  const tips = [
    "Respond within 3 minutes to inquiries",
    "Offer 5–10% discount for users",
    "Improve profile images & reviews",
  ];
  return (
    <div style={{
      background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
      border: "1px solid #ddd6fe", borderRadius: 12,
      padding: "14px 16px", marginTop: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>🔄</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#4c1d95" }}>Improve Conversion</span>
      </div>
      {tips.map((tip, i) => (
        <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: i < tips.length - 1 ? 7 : 0 }}>
          <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: 12, marginTop: 1 }}>✓</span>
          <span style={{ fontSize: 12, color: "#5b21b6", lineHeight: 1.5 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Service Locations Horizontal Bar ── */
function ServiceLocationsChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useChartJs((Chart) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Kendrapada", "Balasore", "Bhubaneswar", "Cuttack", "Puri"],
        datasets: [{
          data: [22, 28, 75, 42, 60],
          backgroundColor: ["#f87171","#fbbf24","#f97316","#a78bfa","#60a5fa"],
          borderRadius: 6, borderSkipped: false,
          hoverBackgroundColor: ["#ef4444","#f59e0b","#ea580c","#8b5cf6","#3b82f6"],
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#0f172a", titleFont: { family: "'DM Sans'", size: 11 },
            bodyFont: { family: "'DM Mono'", size: 11 }, padding: 10, cornerRadius: 8,
            callbacks: { label: (ctx) => ` Count: ${ctx.parsed.x}` },
          },
        },
        scales: {
          x: { min: 0, max: 85, ticks: { font: { size: 10 }, color: "#94a3b8" }, grid: { color: "rgba(0,0,0,0.04)" } },
          y: { ticks: { font: { size: 11 }, color: "#374151" }, grid: { display: false } },
        },
      },
    });
  });
  return <div style={{ height: 185 }}><canvas ref={canvasRef} /></div>;
}

/* ── Monthly Revenue Bar ── */
function MonthlyRevenueChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useChartJs((Chart) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [{
          label: "My Revenue",
          data: [30000, 65000, 40000, 55000, null, null, null, null, null, null, null, null],
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return "#60a5fa";
            const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            grad.addColorStop(0, "#3b82f6");
            grad.addColorStop(1, "#93c5fd");
            return grad;
          },
          borderRadius: 6, borderSkipped: false,
          hoverBackgroundColor: "#2563eb",
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { font: { size: 11, family: "'DM Sans'" }, boxWidth: 10, padding: 12 } },
          tooltip: {
            backgroundColor: "#0f172a", titleFont: { family: "'DM Sans'", size: 11 },
            bodyFont: { family: "'DM Mono'", size: 11 }, padding: 10, cornerRadius: 8,
            callbacks: { label: (ctx) => ctx.parsed.y != null ? ` ₹${ctx.parsed.y.toLocaleString("en-IN")}` : " No data" },
          },
        },
        scales: {
          y: {
            min: 0, max: 70000,
            ticks: { callback: (v) => v === 0 ? "0" : `${(v/1000).toFixed(0)}K`, font: { size: 10 }, color: "#94a3b8" },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#94a3b8" } },
        },
      },
    });
  });
  return <div style={{ height: 235 }}><canvas ref={canvasRef} /></div>;
}

/* ── Adjust Pricing Modal ── */
function AdjustPricingModal({ onClose }) {
  const [minAdj, setMinAdj] = useState("1000");
  const [maxAdj, setMaxAdj] = useState("2000");
  const [applied, setApplied] = useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 430, position: "relative",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        fontFamily: "'DM Sans', sans-serif",
      }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 18,
          background: "#f1f5f9", border: "none", borderRadius: "50%",
          width: 30, height: 30, fontSize: 16, cursor: "pointer", color: "#64748b",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>💰</span>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Adjust Your Pricing</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 22px", lineHeight: 1.6 }}>
          Based on Bhubaneswar demand data, we recommend increasing your prices to match market trends.
        </p>

        <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
          {[["Min Increase (₹)", minAdj, setMinAdj], ["Max Increase (₹)", maxAdj, setMaxAdj]].map(([label, val, setter]) => (
            <div key={label} style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
              <input type="number" value={val} onChange={e => setter(e.target.value)}
                style={{
                  width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 10,
                  padding: "9px 12px", fontSize: 14, fontWeight: 600, color: "#0f172a",
                  outline: "none", fontFamily: "'DM Mono'", transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          ))}
        </div>

        <div style={{
          background: "#fffbeb", border: "1px solid #fde68a",
          borderRadius: 10, padding: "11px 14px", marginBottom: 22,
          fontSize: 13, color: "#92400e", lineHeight: 1.6,
        }}>
          💡 Increasing by <strong>₹{parseInt(minAdj || 0).toLocaleString("en-IN")} – ₹{parseInt(maxAdj || 0).toLocaleString("en-IN")}</strong> could boost your revenue by up to <strong>15%</strong>.
        </div>

        {applied ? (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10,
            padding: "12px 14px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#16a34a",
          }}>
            ✅ Pricing updated! Increase of ₹{minAdj}–₹{maxAdj} applied.
          </div>
        ) : (
          <button
            className="btn-primary"
            onClick={() => setApplied(true)}
            style={{
              width: "100%", background: "#1e3a5f", color: "#fff",
              border: "none", borderRadius: 12, padding: "12px 0",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              letterSpacing: "0.02em", fontFamily: "'DM Sans'",
            }}>
            Apply Pricing Adjustment
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Smart Tips Banner ── */
function SmartTipsBanner() {
  const tips = [
    { icon: "📝", text: <><strong>Increase your price by ₹1,000–₹2,000</strong> &nbsp;Demand is high in your category this month (+18%)</> },
    { icon: "🔄", text: <><strong>Offer 10% discount in Balasore</strong> &nbsp;Low conversion rate detected (only 22%)</> },
    { icon: "⚡", text: <><strong>Tip:</strong> Weekend bookings are 2× higher – enable availability</> },
  ];
  return (
    <div style={{
      background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
      border: "1px solid #e9e97a", borderRadius: 14,
      padding: "14px 18px", marginBottom: 16,
    }}>
      {tips.map((t, i) => (
        <div key={i} className="tip-row" style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < tips.length - 1 ? 8 : 0 }}>
          <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{t.icon}</span>
          <p style={{ margin: 0, fontSize: 12.5, color: "#374151", lineHeight: 1.6, fontFamily: "'DM Sans'" }}>{t.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Main Export ── */
export default function MarketAnalytics() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: "18px 18px 50px", background: "#f1f5f9", minHeight: "100%", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>📈 Market Analytics</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#64748b" }}>Live insights for your service area · April 2026</p>
        </div>
        <div style={{
          background: "#dbeafe", border: "1px solid #93c5fd",
          borderRadius: 20, padding: "5px 14px",
          fontSize: 11.5, fontWeight: 600, color: "#1e40af",
        }}>
          🔴 Live
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: 14 }}>
        <KpiCard icon="💰" label="Total Revenue" value="₹2,10,000" sub="↑ +8% vs last month" bg="#fffbeb" border="#fed7aa" />
        <KpiCard icon="📊" label="Conversion Rate" value="32%" sub="↑ +6%" bg="#f5f3ff" border="#ddd6fe" />
        <KpiCard icon="💰" label="Avg Customer Budget" value="₹25K–₹35K" bg="#fffbeb" border="#fed7aa" />
        <KpiCard icon="📍" label="High Demand Area" value="Bhubaneswar" sub="↑ +30% demand" bg="#f0fdf4" border="#bbf7d0" />
      </div>

      {/* ── Smart Tips ── */}
      <SmartTipsBanner />

      {/* ── Row 1: Market Trends + Booking Distribution ── */}
      <div style={{ display: "grid", gridTemplateColumns: "70% 30%", gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle>Market Price &amp; Demand Trends</SectionTitle>
          <MarketTrendsChart />
          <InsightBox text={
            <><strong>Insight:</strong><br />
            Your price is 12% lower than market & other vendors' price.<br />
            You can safely increase pricing without losing bookings.</>
          } />
        </Card>

        <Card>
          <SectionTitle>Booking Distribution</SectionTitle>
          <BookingDistributionChart />
          <InsightBox
            icon="💡"
            text={<><strong>Insight</strong><br />50% users are only inquiring — improve conversion with better pricing or faster response.</>}
            color="#f5f3ff" border="#ddd6fe" textColor="#5b21b6"
          />
          <ImproveConversionCard />
        </Card>

      </div>

      {/* ── Row 2: Service Locations ── */}
      <Card style={{ marginBottom: 14 }}>
        <SectionTitle>Most Service Location's</SectionTitle>
        <ServiceLocationsChart />
        <InsightBox text={
          <><strong>Insight:</strong><br />
          Bhubaneswar has the highest Price service Location.<br />
          Consider increasing price or targeting premium customers here.</>
        } />
      </Card>
      {showModal && <AdjustPricingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
