import { Image as ImageIcon, Loader2 } from "lucide-react"
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
        className={`h-full min-h-[16rem] w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-6 transition-all duration-300 relative overflow-hidden group ${isUploading
          ? 'bg-muted/40 border-muted-foreground/20 cursor-not-allowed select-none'
          : 'bg-muted/30 hover:bg-muted/50 border-muted-foreground/20 hover:border-primary/50'
          }`}
      >
        {/* Infinite subtle background shimmer wave when uploading */}
        {isUploading && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-background/10 to-transparent animate-[shimmer_2s_infinite]" />
        )}

        <div className={`p-3.5 rounded-full shadow-sm border transition-all duration-500 ${isUploading
          ? 'bg-background scale-95 shadow-inner border-primary/20'
          : 'bg-background group-hover:shadow-md group-hover:scale-105 border-muted'
          }`}>
          {isUploading ? (
            <div className="relative flex items-center justify-center h-7 w-7">
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping duration-1000" />
              <Loader2 className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: '0.8s' }} />
            </div>
          ) : (
            <ImageIcon className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 z-10 text-center">
          <span className={`font-semibold transition-colors text-base tracking-tight ${isUploading ? 'text-foreground' : 'text-foreground group-hover:text-primary'
            }`}>
            {isUploading ? (
              <span className="flex items-center gap-1 justify-center">
                Processing Upload
                <span className="flex gap-0.5 items-center inline-flex h-3">
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                </span>
              </span>
            ) : (
              'Add New Step'
            )}
          </span>
          <span className="text-xs text-muted-foreground/80 font-medium">
            {isUploading ? 'Uploading context and building container...' : 'Upload image to add'}
          </span>
        </div>
      </Button>
    </>
  )
}

export default StepAdd
