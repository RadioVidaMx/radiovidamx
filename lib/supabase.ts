import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL initialized:", !!supabaseUrl)
console.log("Supabase Key initialized:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Some features may not work.")
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)

// Types for our database tables
export type Event = {
    id: string
    title: string
    date: string
    time: string
    location: string
    description: string
    featured: boolean
    image_url?: string
    link?: string
    created_at: string
    updated_at: string
}

export type Program = {
    id: string
    day: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'
    time: string
    title: string
    host: string
    type: 'worship' | 'teaching' | 'talk' | 'prayer' | 'music'
    icon: string
    created_at: string
    updated_at: string
}

export type Video = {
    id: string
    youtube_id: string
    title?: string
    display_order: number
    created_at: string
}

export type GalleryImage = {
    id: string
    src: string
    alt?: string
    title?: string
    display_order: number
    created_at: string
}
