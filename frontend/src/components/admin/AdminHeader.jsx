import { Search, Bell, User } from 'lucide-react';

export default function AdminHeader({ activeTab }) {
  return (
    <header className="bg-[#f2e1ad] text-black shadow-sm border-b border-yellow-300 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-black placeholder:text-gray-600"
            />
          </div>
          <button className="p-2 text-white hover:bg-yellow-300 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-yellow-400 px-3 py-2 rounded-lg">
            <User className="w-4 h-4 text-black" />
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
