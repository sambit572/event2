// src/pages/Dashboard.jsx
import React, { useRef, useState } from "react";
import { BarChart3, Calendar, DollarSign, Users } from "lucide-react";
// 🟣 local layout components – adjust the paths if yours differ
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import VendorSection from "../../components/admin/VendorSection.jsx";

import CustomerSection from "../../components/admin/CustomerSection.jsx";

import BookingSection from "../../components/admin/BookingSection.jsx";

import EarningSection from "../../components/admin/EarningSection.jsx";

import GlimpseTable from "../../components/admin/GlimpseTable.jsx";



const PAGE_SIZE = 5;

export default function AdminDashboard() {

  const vendorRef = useRef(null);
  const customerRef = useRef(null);
  const bookingRef = useRef(null);
  const earningRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  /* -------------------------------------------------- */
  /* Tabs & table-page state                            */
  /* -------------------------------------------------- */
  const [activeTab, setActiveTab] = useState("dashboard");
  const [vendorPage, setVendorPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);
  const [earningPage, setEarningPage] = useState(1);

  /* -------------------------------------------------- */
  /* Mock summary stats                                 */
  /* -------------------------------------------------- */
  const summaryData = [
    {
      title: "Total Vendors",
      value: "120",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Users",
      value: "5,430",
      icon: Users,
      color: "from-purple-600 to-purple-700",
    },
    {
      title: "Total Bookings",
      value: "1,200",
      icon: Calendar,
      color: "from-purple-700 to-purple-800",
    },
    {
      title: "Total Earnings",
      value: "$15,350",
      icon: DollarSign,
      color: "from-purple-800 to-purple-900",
    },
  ];

  /* -------------------------------------------------- */
  /* Table data                                         */
  /* -------------------------------------------------- */
  const vendorData = [
    { name: "Vendor A", service: "Catering", status: "Active", bookings: 35 },
    {
      name: "Vendor B",
      service: "Photography",
      status: "Active",
      bookings: 42,
    },
    {
      name: "Vendor C",
      service: "DJ Services",
      status: "Active",
      bookings: 17,
    },
    { name: "Vendor D", service: "Floristry", status: "Active", bookings: 50 },
    { name: "Vendor E", service: "Lighting", status: "Active", bookings: 22 },
  ];

  const customerData = [
    {
      name: "John Doe",
      email: "john@example.com",
      lastActive: "Today",
      bookings: 5,
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      lastActive: "Yesterday",
      bookings: 3,
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      lastActive: "2 days ago",
      bookings: 8,
    },
    {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      lastActive: "3 days ago",
      bookings: 2,
    },
    {
      name: "David Lee",
      email: "david@example.com",
      lastActive: "4 days ago",
      bookings: 4,
    },
  ];

  const bookingsData = [
    {
      id: "BK001",
      user: "Amit",
      vendor: "LuxeEvents",
      service: "Wedding Planning",
      date: "2025-06-14",
      status: "Confirmed",
    },
    {
      id: "BK002",
      user: "Riya",
      vendor: "Bliss Decor",
      service: "Decoration",
      date: "2025-06-13",
      status: "Pending",
    },
    {
      id: "BK003",
      user: "Sourav",
      vendor: "BrightLights",
      service: "Lighting",
      date: "2025-06-12",
      status: "Cancelled",
    },
    {
      id: "BK004",
      user: "Neha",
      vendor: "Elite Sounds",
      service: "DJ Setup",
      date: "2025-06-11",
      status: "Received",
    },
    {
      id: "BK005",
      user: "Vikram",
      vendor: "ChefMasters",
      service: "Catering",
      date: "2025-06-10",
      status: "Confirmed",
    },
    {
      id: "BK006",
      user: "Tara",
      vendor: "Florista",
      service: "Floristry",
      date: "2025-06-09",
      status: "Confirmed",
    },
  ];

  const earningsData = [
    {
      date: "2025-06-15",
      amount: "$1,250",
      source: "Catering Services",
      status: "Received",
    },
    {
      date: "2025-06-14",
      amount: "$890",
      source: "Photography",
      status: "Received",
    },
    {
      date: "2025-06-13",
      amount: "$675",
      source: "DJ Services",
      status: "Pending",
    },
    {
      date: "2025-06-12",
      amount: "$1,100",
      source: "Floristry",
      status: "Received",
    },
    {
      date: "2025-06-11",
      amount: "$560",
      source: "Lighting",
      status: "Received",
    },
    {
      date: "2025-06-10",
      amount: "$420",
      source: "Decoration",
      status: "Cancelled",
    },
  ];

  /* -------------------------------------------------- */
  /* Pagination slices                                  */
  /* -------------------------------------------------- */
  const vendorSlice = vendorData.slice(
    (vendorPage - 1) * PAGE_SIZE,
    vendorPage * PAGE_SIZE
  );
  const customerSlice = customerData.slice(
    (customerPage - 1) * PAGE_SIZE,
    customerPage * PAGE_SIZE
  );
  const bookingSlice = bookingsData.slice(
    (bookingPage - 1) * PAGE_SIZE,
    bookingPage * PAGE_SIZE
  );
  const earningSlice = earningsData.slice(
    (earningPage - 1) * PAGE_SIZE,
    earningPage * PAGE_SIZE
  );

  const vendorPages = Math.ceil(vendorData.length / PAGE_SIZE);
  const customerPages = Math.ceil(customerData.length / PAGE_SIZE);
  const bookingPages = Math.ceil(bookingsData.length / PAGE_SIZE);
  const earningPages = Math.ceil(earningsData.length / PAGE_SIZE);

  /* -------------------------------------------------- */
  /* Helpers                                            */
  /* -------------------------------------------------- */
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
      case "received":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* ── Sidebar ─────────────────────────────────── */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scrollToSection={scrollToSection}
        refs={{
          vendors: vendorRef,
          customers: customerRef,
          bookings: bookingRef,
          earnings: earningRef,
        }}
      />

      {/* ── Main content ────────────────────────────── */}
      <main className="flex-1 overflow-hidden">
        <AdminHeader activeTab={activeTab} />

        <div className="p-6 overflow-y-auto h-full space-y-12">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {summaryData.map(({ title, value, icon: Icon, color }, i) => (
    <div
      key={i}
      className="group bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1"
    >
      <div
        className={`
          bg-gradient-to-r ${color} 
          group-hover:from-sky-500 group-hover:to-fuchsia-500
          p-4 flex justify-between items-center rounded-t-xl transition-colors duration-300
        `}
      >
        <Icon className="w-8 h-8 text-white" />
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-purple-100">{title}</p>
        </div>
      </div>
    </div>
  ))}
</div>


          {/* Glimpses on Dashboard */}
          {activeTab === "dashboard" && (
            <>
              <div ref={vendorRef}>
                <GlimpseTable
                  title="Vendor Management"
                  headers={["Name", "Service", "Status", "Bookings"]}
                  rows={vendorSlice.map((v) => [
                    v.name,
                    v.service,
                    v.status,
                    v.bookings,
                  ])}
                  pages={vendorPages}
                  page={vendorPage}
                  setPage={setVendorPage}
                  statusCol={2}
                  getStatusColor={getStatusColor}
                />
              </div>

              <div ref={customerRef}>
                <GlimpseTable
                  title="Customer Management"
                  headers={["Name", "Email", "Last Active", "Bookings"]}
                  rows={customerSlice.map((c) => [
                    c.name,
                    c.email,
                    c.lastActive,
                    c.bookings,
                  ])}
                  pages={customerPages}
                  page={customerPage}
                  setPage={setCustomerPage}
                />
              </div>

              <div ref={bookingRef}>
                <GlimpseTable
                  title="Recent Bookings"
                  headers={[
                    "Booking ID",
                    "User",
                    "Vendor",
                    "Service",
                    "Date",
                    "Status",
                  ]}
                  rows={bookingSlice.map((b) => [
                    b.id,
                    b.user,
                    b.vendor,
                    b.service,
                    b.date,
                    b.status,
                  ])}
                  pages={bookingPages}
                  page={bookingPage}
                  setPage={setBookingPage}
                  statusCol={5}
                  getStatusColor={getStatusColor}
                />
              </div>

              <div ref={earningRef}>
                <GlimpseTable
                  title="Recent Earnings"
                  headers={["Date", "Amount", "Source", "Status"]}
                  rows={earningSlice.map((e) => [
                    e.date,
                    e.amount,
                    e.source,
                    e.status,
                  ])}
                  pages={earningPages}
                  page={earningPage}
                  setPage={setEarningPage}
                  statusCol={3}
                  getStatusColor={getStatusColor}
                />
              </div>
            </>
          )}

          {/* Other Full Sections */}
          {activeTab === "vendors" && <VendorSection />}
          {activeTab === "customers" && <CustomerSection />}
          {activeTab === "bookings" && <BookingSection />}
          {activeTab === "earnings" && <EarningSection />}
        </div>
      </main>
    </div>
  );
}

