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
        className="w-full h-full min-h-[16rem] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-2xl p-6 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
          {isUploading ? (
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          ) : (
            <ImageIcon className="h-7 w-7 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1 text-center mt-2">
          <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors text-base">
            {isUploading ? 'Uploading...' : 'Add New Step'}
          </span>
          <span className="text-xs text-slate-500 font-medium px-4">
            {isUploading ? 'Please wait...' : 'Upload image to add'}
          </span>
        </div>
      </button>
    </>
  )
}

export default StepAdd
