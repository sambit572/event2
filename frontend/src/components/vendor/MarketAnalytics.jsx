import React, { useEffect, useRef, useState } from "react";

// Lazy-load Chart.js from CDN
function useChartJs(callback) {
  useEffect(() => {
    if (window.Chart) {
      callback(window.Chart);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => callback(window.Chart);
    document.head.appendChild(script);
  }, []);
}

/* ─── KPI Card ─── */
function KpiCard({ icon, label, value, badge, badgeColor, trend, trendColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span className="text-lg">{icon}</span>
        {label}
      </div>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <span className="text-2xl font-bold text-[#1e293b] leading-tight">{value}</span>
        {badge && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: badgeColor || "#fef9c3", color: "#92400e" }}
          >
            {badge}
          </span>
        )}
        {trend && (
          <span className="text-sm font-semibold" style={{ color: trendColor || "#16a34a" }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Market Trends Line Chart ─── */
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
            label: "Your Price (₹)",
            data: [22000,25000,24000,27000,28000,30000,31000,33000,32000,34000,35000,37000],
            borderColor: "#6d28d9",
            backgroundColor: "rgba(109,40,217,0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#6d28d9",
            borderWidth: 2,
          },
          {
            label: "Market Average (₹)",
            data: [20000,22000,23000,25000,27000,29000,30000,31000,31500,33000,34000,35500],
            borderColor: "#059669",
            backgroundColor: "rgba(5,150,105,0.06)",
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#059669",
            borderWidth: 2,
            borderDash: [5,3],
          },
          {
            label: "Demand Trend",
            data: [18000,19000,20000,21000,24000,27000,29000,30000,32000,33500,35000,38000],
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.06)",
            fill: false,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#f59e0b",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 12 }, boxWidth: 14, padding: 16 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => `₹${(v/1000).toFixed(0)}k`,
              font: { size: 11 },
            },
            grid: { color: "rgba(0,0,0,0.04)" },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    });
  });

  return (
    <div className="relative" style={{ height: "260px" }}>
      <canvas ref={canvasRef} />
      {/* Annotations */}
      <div
        className="absolute top-4 left-12 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-lg pointer-events-none"
        style={{ whiteSpace: "nowrap" }}
      >
        Low Booking → Reduce Price <span className="text-red-500 font-bold">-8%</span>
      </div>
      <div
        className="absolute top-4 right-8 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg pointer-events-none"
        style={{ whiteSpace: "nowrap" }}
      >
        High Demand → Increase Price <span className="text-green-600 font-bold">+12%</span>
      </div>
    </div>
  );
}

/* ─── Region Pie Chart ─── */
function RegionPieChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useChartJs((Chart) => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Bhubaneswar", "Cuttack", "Balasore", "Puri"],
        datasets: [{
          data: [125, 90, 50, 45],
          backgroundColor: ["#6d28d9","#f59e0b","#e879f9","#38bdf8"],
          borderWidth: 2,
          borderColor: "#fff",
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} requests`,
            },
          },
        },
      },
    });
  });

  return (
    <div style={{ height: "180px", width: "180px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

/* ─── Pricing Modal ─── */
function AdjustPricingModal({ onClose }) {
  const [minAdj, setMinAdj] = useState("1000");
  const [maxAdj, setMaxAdj] = useState("2000");
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >✕</button>
        <h2 className="text-xl font-bold text-[#1e293b] mb-1">Adjust Your Pricing</h2>
        <p className="text-sm text-gray-500 mb-6">
          Based on Bhubaneswar demand data, we recommend increasing your prices.
        </p>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Min Increase (₹)</label>
            <input
              type="number"
              value={minAdj}
              onChange={e => setMinAdj(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Max Increase (₹)</label>
            <input
              type="number"
              value={maxAdj}
              onChange={e => setMaxAdj(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-6 text-sm text-yellow-800">
          💡 Increasing by ₹{parseInt(minAdj||0).toLocaleString("en-IN")} – ₹{parseInt(maxAdj||0).toLocaleString("en-IN")} could boost your revenue by up to <strong>15%</strong>.
        </div>
        <button
          onClick={() => { alert(`✅ Pricing updated! Increase of ₹${minAdj}–₹${maxAdj} applied to your services.`); onClose(); }}
          className="w-full bg-[#001f3f] text-white py-2.5 rounded-xl font-semibold hover:bg-[#002d5a] transition-colors"
        >
          Apply Pricing Adjustment
        </button>
      </div>
    </div>
  );
}

/* ─── Main MarketAnalytics Component ─── */
export default function MarketAnalytics() {
  const [showModal, setShowModal] = useState(false);

  const regions = [
    { name: "Bhubaneswar", count: 125, badge: "+30%", color: "#6d28d9" },
    { name: "Cuttack",     count: 90,  badge: null,   color: "#f59e0b" },
    { name: "Balasore",    count: 50,  badge: null,   color: "#e879f9" },
    { name: "Puri",        count: 45,  badge: null,   color: "#38bdf8" },
  ];

  const maxCount = Math.max(...regions.map(r => r.count));

  return (
    <div className="px-4 pb-8 pt-2 space-y-5">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-[#1e293b]">Market Analytics</h1>
        <span className="text-gray-400 text-sm">✦</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="💰" label="Total Revenue" value="₹2,10,000" trend="↑ +8%" trendColor="#16a34a" />
        <KpiCard icon="🏷️" label="Your Avg Price" value="₹28,000" trend="↑ +5%" trendColor="#16a34a" />
        <KpiCard icon="📊" label="Vs Market Price" value="-12%" trend="↓" trendColor="#dc2626" badge="Below Market" badgeColor="#fee2e2" />
        <KpiCard icon="📍" label="High Demand Area" value="Bhubaneswar" badge="+30%" badgeColor="#fef9c3" />
      </div>

      {/* Recommendation Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div>
            <span className="font-bold text-yellow-900 text-sm">Recommendation: </span>
            <span className="text-yellow-800 text-sm">
              Focus on Bhubaneswar. Increase your prices by{" "}
              <strong>₹1000–₹2000</strong> to match demand, especially for premium services.
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 bg-[#001f3f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#002d5a] transition-colors whitespace-nowrap"
        >
          Adjust Pricing
        </button>
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h2 className="text-base font-bold text-[#1e293b]">Market Trends</h2>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            This Week's Pricing Insight
          </span>
          <span className="ml-auto text-xs text-gray-400 font-medium">Last 12 months</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">DJ Services &amp; Brass Band — Odisha Region</p>
        <MarketTrendsChart />
        <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-purple-800 font-medium">
          🎯 <strong>Demand is high.</strong> Increase prices by{" "}
          <span className="font-bold">10–15%</span> to capture more bookings.
        </div>
      </div>

      {/* Region-wise Requests + My Service Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Region-wise Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-[#1e293b] mb-0.5">My Statics</h2>
          <p className="text-xs text-gray-400 mb-4">Last 30 days performance</p>

          <div className="flex items-center gap-6">
            <RegionPieChart />
            <div className="flex-1 space-y-3">
              {regions.map((r) => (
                <div key={r.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-sm text-gray-700 truncate">{r.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#1e293b]">{r.count}</span>
                  {r.badge && (
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                      {r.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal bars */}
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">My Revenue</p>
            {regions.map((r) => (
              <div key={r.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 shrink-0">{r.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(r.count / maxCount) * 100}%`,
                      background: r.color,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Service Report */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-bold text-[#1e293b] mb-4">My Service Report</h2>

          {[
            { color: "#6d28d9", label: "Booking",          count: 232, status: "Done" },
            { color: "#f59e0b", label: "Service Inquiry",  count: 196, status: "Done" },
            { color: "#e879f9", label: "Profile Views",    count: 50,  status: "Done" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="flex-1 text-sm text-gray-700 font-medium">{item.label}</span>
              <span className="text-sm font-bold text-[#1e293b]">{item.count}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                ✓ {item.status}
              </span>
            </div>
          ))}

          {/* Summary stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Conversion Rate", value: "18.5%" },
              { label: "Avg Response Time", value: "2.4 hrs" },
              { label: "Rating", value: "4.8 ⭐" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-[#1e293b]">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Read more →
          </button>
        </div>
      </div>

      {showModal && <AdjustPricingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
