export function Loader({ className = "" }) {
    return (
        <div className={`flex items-center justify-center min-h-screen ${className}`}>
        {/* Outer ring */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 relative">
                <div className="absolute inset-0 rounded-full border-4 md:border-6 lg:border-8 border-gray-200"></div>

                {/* Inner spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 md:border-6 lg:border-8 border-transparent border-t-blue-600 animate-spin"></div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-blue-600 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

// Alternative elegant loader designs
export function DotsLoader({ className = "" }) {
    return (
        <div className={`flex items-center justify-center min-h-screen ${className}`}>
            <div className="flex items-center justify-center space-x-4 md:space-x-6 lg:space-x-8">
                <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full animate-pulse"></div>
                <div
                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
                ></div>
            </div>
        </div>
    )
}

export function BarLoader({ className = "" }) {
    return (
        <div className={`flex items-center justify-center min-h-screen ${className}`}>
            <div className="w-64 h-3 sm:w-80 sm:h-4 md:w-96 md:h-5 lg:w-32 lg:h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
        </div>
    )
}
