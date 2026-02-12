import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function getUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
}

export async function requireAuth() {
    const user = await getUser()
    if (!user) {
        redirect("/admin/login")
    }
    return user
}

export async function signOut() {
    await supabase.auth.signOut()
    redirect("/admin/login")
}
