// components/Header.jsx

import { Search, Bell, User } from 'lucide-react';

export default function AdminHeader({ activeTab }) {
  return (
    <header className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm border-b border-purple-100 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-white focus:outline-none bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <button className="p-2 text-white hover:bg-purple-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-purple-700 px-3 py-2 rounded-lg">
            <User className="w-4 h-4 text-white" />
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
