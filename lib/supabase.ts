import { createClient } from '@supabase/supabase-js'

console.log("Supabase URL initialized:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Supabase Key initialized:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
