import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow access to login and reset-password pages
    if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
        return NextResponse.next()
    }

    // Check authentication for all other /admin routes
    if (pathname.startsWith("/admin")) {
        try {
            // Get Supabase credentials from environment
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

            if (!supabaseUrl || !supabaseAnonKey) {
                // If credentials not set, allow through (will error appropriately in component)
                return NextResponse.next()
            }

            // Create Supabase client
            const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            })

            // Get session from cookies
            const token = request.cookies.get("sb-access-token")?.value
            console.log("Middleware checking token for:", pathname, "Token exists:", !!token)

            if (!token) {
                console.log("No token found, redirecting to login")
                const redirectUrl = new URL("/admin/login", request.url)
                return NextResponse.redirect(redirectUrl)
            }

            // Verify token
            const { data: { user }, error } = await supabaseClient.auth.getUser(token)

            if (error || !user) {
                console.log("Invalid token or user, redirecting to login. Error:", error?.message)
                const redirectUrl = new URL("/admin/login", request.url)
                return NextResponse.redirect(redirectUrl)
            }

            console.log("Middleware: User authorized:", user.email)

            // User is authenticated, allow through
            return NextResponse.next()
        } catch (error) {
            // On error, redirect to login
            const redirectUrl = new URL("/admin/login", request.url)
            return NextResponse.redirect(redirectUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
