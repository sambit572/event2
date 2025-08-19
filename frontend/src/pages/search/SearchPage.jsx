"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DotsLoader } from "../../components/search/Loader"
import { NotFound } from "../../components/search/NotFound"
import { SearchResult }from "../../components/search/SearchResult"
import { SearchSidebar } from "../../components/search/SearchSidebar"
import { BACKEND_URL } from "../../utils/constant"
import axios from "axios"

const SearchPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const query = searchParams.get("query")
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isNotFound, setIsNotFound] = useState(false)
    const [filters, setFilters] = useState({
        location: "",
        sortBy: "price",
    })
    const [appliedPriceFilters, setAppliedPriceFilters] = useState({
        minPrice: "",
        maxPrice: "",
    })

    useEffect(() => {
        setIsLoading(false)
        setIsNotFound(false)
    }, [])

    useEffect(() => {
        console.log(query)
        if (query) {
        fetchSearchResults(query)
        }
    }, [query])

    const fetchSearchResults = async (searchQuery, priceFilters = {}) => {
        try {
        setIsLoading(true)
        setIsNotFound(false)

        const params = new URLSearchParams()
        if (searchQuery) params.append("q", searchQuery)
        if (priceFilters.minPrice) params.append("minPrice", priceFilters.minPrice)
        if (priceFilters.maxPrice) params.append("maxPrice", priceFilters.maxPrice)

        const response = await axios.get(`${BACKEND_URL}/search?${params.toString()}`)
        const result = response.data.results
        console.log(result)

        setData(result)

        if (result.categories.length === 0 && result.services.length === 0) {
            setIsNotFound(true)
        }
        } catch (error) {
        console.error("Error at fetching Results: ", error)
        setIsNotFound(true)
        } finally {
        setIsLoading(false)
        }
    }

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        // Frontend filtering only - no API call or URL update
    }

    const handlePriceFilterApply = (priceFilters) => {
        setAppliedPriceFilters(priceFilters)

        // Update URL only for price filters
        const params = new URLSearchParams()
        if (query) params.append("query", query)
        if (priceFilters.minPrice) params.append("minPrice", priceFilters.minPrice)
        if (priceFilters.maxPrice) params.append("maxPrice", priceFilters.maxPrice)

        navigate(`/search?${params.toString()}`, { replace: true })
        fetchSearchResults(query, priceFilters)
    }

    const getFilteredData = () => {
        if (!data) return null

        let filteredServices = [...data.services]
        const filteredCategories = [...data.categories]

        // Apply location filter
        if (filters.location) {
        filteredServices = filteredServices.filter((service) => {
            const locations = Array.isArray(service.locationOffered) ? service.locationOffered : [service.locationOffered]
            return locations.includes(filters.location)
        })
        }

        // Apply sorting
        if (filters.sortBy === "price") {
        filteredServices.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))
        } else if (filters.sortBy === "name") {
        filteredServices.sort((a, b) => a.serviceName.localeCompare(b.serviceName))
        } else if (filters.sortBy === "duration") {
        filteredServices.sort((a, b) => (a.duration || 0) - (b.duration || 0))
        }

        return {
        services: filteredServices,
        categories: filteredCategories,
        }
    }

    if (isLoading) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <DotsLoader />
        </div>
        )
    }

    if (isNotFound) {
        return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <NotFound
            title="No search results found"
            subtitle={`We couldn't find anything matching "${query}". Try different keywords or check your spelling.`}
            />
        </div>
        )
    }

    const filteredData = getFilteredData()

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Search Results for "{query}"</h1>
            {filteredData && (
                <p className="text-gray-600">
                Found{" "}
                {filteredData.services.length + filteredData.categories.reduce((total, cat) => total + cat.count, 0)}{" "}
                results
                </p>
            )}
            </div>

            {filteredData && (
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:order-1 order-2">
                <SearchSidebar
                    services={data.services}
                    categories={data.categories}
                    onFiltersChange={handleFiltersChange}
                    onPriceFilterApply={handlePriceFilterApply}
                />
                </div>

                <div className="lg:order-2 order-1 flex-1">
                <SearchResult services={filteredData.services} categories={filteredData.categories} />
                </div>
            </div>
            )}
        </div>
        </div>
    )
}

export default SearchPage