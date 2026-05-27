import { Image as ImageIcon, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { imageService } from "../../../services/imageService"

interface StepAddProps {
  onAdd: (imageUrl: string) => void
}

function StepAdd({ onAdd }: StepAddProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const response = await imageService.uploadImage(file)
      onAdd(response.url)
      
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
         fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50/50 text-gray-500 hover:text-indigo-600 rounded-xl p-8 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow group-hover:scale-110 transition-all">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </div>
        <span className="font-medium">
          {isUploading ? 'Uploading Reference Image...' : 'Upload Reference Image to Add Step'}
        </span>
      </button>
    </>
  )
}

export default StepAdd
