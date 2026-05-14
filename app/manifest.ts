import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Radio Vida Mx',
    short_name: 'Radio Vida',
    description: 'La estación que da Vida. Radio cristiana 24/7.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E63946',
    icons: [
      {
        src: '/logo-radiovida.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/logo-radiovida.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
    ],
  }
}
