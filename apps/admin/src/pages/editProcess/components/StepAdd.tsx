import { Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { imageService } from "../../../services/imageService"
import { Button } from "@/components/ui/button"

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
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="h-full min-h-[16rem] w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed bg-muted/30 hover:bg-muted/50 rounded-xl p-6 transition-all group"
      >
        <div className="bg-background p-3 rounded-full shadow-sm border group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
          {isUploading ? (
            <span className="animate-spin h-7 w-7 border-4 border-primary border-t-transparent rounded-full" />
          ) : (
            <ImageIcon className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
            {isUploading ? 'Uploading...' : 'Add New Step'}
          </span>
          <span className="text-xs text-muted-foreground">
            {isUploading ? 'Please wait...' : 'Upload image to add'}
          </span>
        </div>
      </Button>
    </>
  )
}

export default StepAdd
