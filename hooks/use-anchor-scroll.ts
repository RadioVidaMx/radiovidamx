"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useAnchorScroll() {
    const pathname = usePathname()

    useEffect(() => {
        // Only run if there is a hash in the URL and we are on the home page
        if (typeof window !== "undefined" && window.location.hash && pathname === "/") {
            const hash = window.location.hash

            const scrollToAnchor = () => {
                const element = document.querySelector(hash)
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                }
            }

            // Initial scroll attempt
            scrollToAnchor()

            // Re-attempt scroll after a short delay to account for dynamic content loading
            const timer = setTimeout(scrollToAnchor, 1000)

            return () => clearTimeout(timer)
        }
    }, [pathname])
}
