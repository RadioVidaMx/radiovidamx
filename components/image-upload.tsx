"use client"

import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { Upload, X, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
  bucketName?: string
}

export function ImageUpload({
  onUploadComplete,
  currentImageUrl,
  bucketName = "imagenes"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file types
    if (!file.type.startsWith('image/')) {
        setError("Por favor selecciona un archivo de imagen válido.")
        return
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
        setError("La imagen es demasiado grande. Máximo 5MB.")
        return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      onUploadComplete(publicUrl)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError("Error al subir la imagen: " + (err.message || "Error desconocido"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onUploadComplete("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 min-h-[200px] flex items-center justify-center bg-muted/30 ${
            previewUrl ? 'border-primary/50' : 'border-border hover:border-primary/30'
        }`}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover max-h-[300px]"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={handleRemove}
                >
                    <X className="w-4 h-4 mr-2" /> Eliminar
                </Button>
            </div>
            {isUploading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium">Subiendo imagen...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                    <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer text-primary hover:underline font-semibold block"
                    >
                        Haz clic para subir una foto
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG o WEBP hasta 5MB
                    </p>
                </div>
                <input 
                  id="image-upload"
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                >
                    <Upload className="w-4 h-4 mr-2" /> Seleccionar Archivo
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded border border-red-100 italic">
          ⚠️ {error}
        </p>
      )}

      {previewUrl && !isUploading && !error && (
        <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Imagen lista para guardar
        </div>
      )}
    </div>
  )
}
