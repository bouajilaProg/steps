import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Eye, Upload, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { imageService } from '../../../services/imageService'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export interface Step {
  id: string
  title: string
  imageUrl: string
}

interface StepItemProps {
  step: Step
  index: number
  onUpdate: (id: string, updates: Partial<Step>) => void
  onRemove: (id: string) => void
  onPreview: (url: string) => void
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  if (args.wasDragging && !args.isSorting) {
    return false
  }
  return defaultAnimateLayoutChanges(args)
}

function StepItem({ step, index, onUpdate, onRemove, onPreview }: StepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id, animateLayoutChanges })

  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 50 : 1,
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const response = await imageService.uploadImage(file)
      onUpdate(step.id, { imageUrl: response.url })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item ${isDragging ? 'opacity-90 z-50 ring-2 ring-ring shadow-2xl' : ''}`}
    >
      <Card className="overflow-hidden rounded-xl transition-shadow hover:shadow-md p-0 gap-0">
        <div className="relative h-48 sm:h-52 w-full bg-muted overflow-hidden group/img flex-shrink-0">

          <div
            {...attributes}
            {...listeners}
            className="absolute top-3 left-3 z-10 flex items-center justify-center h-8 w-8 rounded-md bg-background/90 hover:bg-background backdrop-blur-md cursor-grab active:cursor-grabbing text-muted-foreground border shadow-sm"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <Badge className="absolute top-3 right-3 z-10 shadow-sm">
            {index + 1}
          </Badge>

          {isUploading ? (
            /* Enhanced Micro-interaction Loader */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-md transition-all animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center h-12 w-12">
                {/* Ambient breathing aura */}
                <span className="absolute h-full w-full rounded-full bg-primary/10 animate-ping duration-1000 opacity-75" />
                {/* Secondary stabilizing track */}
                <span className="absolute h-10 w-10 rounded-full border-2 border-primary/10" />
                {/* Smooth native spinner */}
                <Loader2 className="h-10 w-10 text-primary animate-spin dynamic-built-in" style={{ animationDuration: '0.85s' }} />
              </div>

              <div className="flex flex-col items-center gap-0.5 animate-in slide-in-from-bottom-2 duration-300">
                <span className="text-sm font-semibold tracking-wide text-foreground flex items-center gap-1.5">
                  Updating Title
                  {/* Fluid CSS loading dots */}
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground/80 font-medium tracking-normal">Optimizing image assets...</span>
              </div>
            </div>
          ) : (
            <>
              <img src={step.imageUrl} alt={step.title || 'Step reference'} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(step.imageUrl)
                  }}
                  title="Preview Image"
                  className="shadow-lg"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  title="Replace Image"
                  className="shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        <CardContent className="p-4 flex items-center gap-3">
          <Input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate(step.id, { title: e.target.value })}
            placeholder="Step Title..."
            className="text-base font-semibold border-0 border-b border-transparent hover:border-input focus:border-primary px-1 py-1 bg-transparent rounded-none shadow-none placeholder:text-muted-foreground"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(step.id)}
            className="text-muted-foreground hover:text-destructive shrink-0"
            title="Remove step"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default StepItem
