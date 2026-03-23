export function NotFound({
    message = "Oops! No results found",
    subtitle = "Try adjusting your search terms or browse our categories",
    showSearchIcon = true,
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
            <div className="text-center max-w-md mx-auto">
                {/* Search Icon */}
                {showSearchIcon && (
                <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                )}

                {/* Main Message */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">{message}</h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 leading-relaxed">{subtitle}</p>

                {/* Action Button */}
                <button className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    Try Again
                </button>
            </div>
        </div>
    )
}

// Alternative compact version for smaller spaces
export function NotFoundCompact({ message = "No results found" }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{message}</p>
            </div>
        </div>
    )
}
