import { Search, Bell, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader({ activeTab }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="bg-[#f2e1ad] text-black shadow-sm border-b border-yellow-300 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex justify-between items-center">
        {/* Left side - Title */}
        <div className="flex items-center gap-3">
          {/* Mobile menu space (handled by sidebar) */}
          <div className="w-10 lg:w-0"></div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold capitalize truncate">
            {activeTab}
          </h2>
        </div>

        {/* Right side - Search, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ">
          {/* Search - Responsive behavior */}
          <div className="relative">
            {/* Desktop search - always visible */}
            <div className="hidden sm:flex relative  ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-32 md:w-48 lg:w-64 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-black placeholder:text-gray-600 text-sm "
              />
            </div>
            
            {/* Mobile search - expandable */}
            <div className="sm:hidden ">
              {isSearchExpanded ? (
                <div className="relative right-0 top-0 flex items-center">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-40 px-3 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-white text-black placeholder:text-gray-600 text-sm max-[344px]:w-[110px] max-[344px]:mr-2"
                    autoFocus
                    onBlur={() => setIsSearchExpanded(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-1.5 text-gray-600 bg-yellow-400 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications */}
          <button className="p-1.5 sm:p-2 text-white-300 bg-green-600 rounded-lg transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-1 sm:gap-2 bg-yellow-400 px-2 sm:px-3 py-2 sm:py-2 rounded-lg">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-black flex-shrink-0 " />
           <span className="font-medium text-xs sm:text-sm hidden xs:inline mr-2">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}