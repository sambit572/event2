import { BarChart3, Users, Calendar, DollarSign } from 'lucide-react';

export default function AdminSidebar({ scrollToSection, refs }) {
  const menu = [
    { key: "vendors", label: "Vendors", icon: BarChart3 },
    { key: "customers", label: "Customers", icon: Users },
    { key: "bookings", label: "Bookings", icon: Calendar },
    { key: "earnings", label: "Earnings", icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-[#f2e1ad] text-black flex flex-col shadow-2xl">
      <div className="p-6 border-b border-yellow-500">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
          <BarChart3 className="w-8 h-8" />
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-3">
          {menu.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                onClick={() => scrollToSection(refs[key])}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-[#f3c12d] hover:bg-[#001F3F] hover:translate-x-1"
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
