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
    display_order: number
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

export type Profile = {
    id: string
    full_name: string
    avatar_url?: string
    role: 'reader' | 'admin'
    updated_at: string
}

export type Article = {
    id: string
    title: string
    slug: string
    content: string
    author_id: string
    author_name: string
    image_url?: string
    likes_count: number
    comments_count: number
    created_at: string
    updated_at: string
}

export type Comment = {
    id: string
    article_id: string
    user_id: string
    content: string
    created_at: string
    profiles?: Profile // For joining
}

export type ArticleLike = {
    id: string
    article_id: string
    user_id: string
}

// Note: The instruction mentioned updating a supabase query in 'EventsSection'.
// As this file only contains type definitions and client initialization,
// and does not have an 'EventsSection' or any query fetching events,
// the query snippet provided in the instruction cannot be placed here
// without breaking the file's structure or purpose.
//
// However, if you were to fetch events and sort them by display_order,
// the query would look like this:
//
// async function fetchEventsSorted() {
//   const { data, error } = await supabase
//     .from("events")
//     .select("*")
//     .order("display_order", { ascending: true });
//
//   if (error) {
//     console.error("Error fetching events:", error);
//     return [];
//   }
//   return data;
// }
//
