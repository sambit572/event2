import { BarChart3, Users, Calendar, DollarSign, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar({ scrollToSection, refs }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menu = [
    { key: "vendors", label: "Vendors", icon: BarChart3 },
    { key: "customers", label: "Customers", icon: Users },
    { key: "bookings", label: "Bookings", icon: Calendar },
    { key: "earnings", label: "Earnings", icon: DollarSign },
  ];

  const handleMenuClick = (ref) => {
    scrollToSection(ref);
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        className="lg:hidden fixed top-2 left-3 z-50 p-2 bg-[#f3c12d] text-black rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay - Only visible when menu is open on small screens */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static 
        top-0 left-0 h-full
        w-64 sm:w-72 lg:w-64
        bg-[#f2e1ad] text-black 
        flex flex-col shadow-2xl
        z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-yellow-500 max-[820px]:ml-[45px]">
          <h1 className="text-xl sm:text-xl font-bold flex items-center gap-2 text-black max-[820px]:text-[15px] mr-[20px]">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
  <ul className="space-y-2 sm:space-y-3">
    {menu.map(({ key, label, icon: Icon }) => (
      <li key={key}>
        <button
          onClick={() => handleMenuClick(refs[key])}
          className="group w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all bg-[#f3c12d] hover:bg-[#001F3F] hover:translate-x-1 text-sm sm:text-base"
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:text-white transition-colors duration-300" />
          <span className="text-black group-hover:text-white transition-colors duration-300 truncate">
            {label}
          </span>
        </button>
      </li>
    ))}
  </ul>
</nav>

      </aside>
    </>
  );
}