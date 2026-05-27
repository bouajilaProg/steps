import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Loader2, Eye, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import { imageService } from '../../../services/imageService'

export interface Step {
  id: string
  title: string
  imageUrl: string
}

interface StepItemProps {
  step: Step
  onUpdate: (id: string, updates: Partial<Step>) => void
  onRemove: (id: string) => void
  onPreview: (url: string) => void
}

function StepItem({ step, onUpdate, onRemove, onPreview }: StepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id })

  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
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
      className={`relative flex gap-4 bg-white p-6 rounded-2xl border ${
        isDragging ? 'border-indigo-500 shadow-2xl opacity-90 scale-[1.02]' : 'border-gray-200 shadow-sm'
      }`}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded-l-2xl transition-colors"
      >
        <GripVertical className="text-gray-400 h-6 w-6" />
      </div>

      <div className="flex-1 ml-10 flex flex-col gap-5">
        
        {/* Title & Actions */}
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            value={step.title}
            onChange={(e) => onUpdate(step.id, { title: e.target.value })}
            placeholder="Step Title (e.g. Patient Registration)"
            className="w-full text-xl font-bold text-gray-900 border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-indigo-500 focus:ring-0 px-0 bg-transparent transition-colors placeholder:text-gray-300"
          />
          <button
            onClick={() => onRemove(step.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors"
            title="Remove step"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Big Image Display */}
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full h-64 sm:h-80 md:h-96 bg-gray-100 flex items-center justify-center shadow-inner">
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 text-indigo-500">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm font-medium">Updating Reference Image...</span>
            </div>
          ) : (
            <>
              <img src={step.imageUrl} alt={step.title || 'Step reference'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => onPreview(step.imageUrl)}
                  className="flex items-center gap-2 text-white text-sm font-semibold bg-white/20 hover:bg-white/30 border border-white/50 px-5 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg hover:scale-105"
                >
                  <Eye className="h-4 w-4" /> Preview
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-white text-sm font-semibold bg-indigo-500/80 hover:bg-indigo-600 border border-indigo-500/50 px-5 py-2.5 rounded-xl backdrop-blur-md transition-all shadow-lg hover:scale-105"
                >
                  <Upload className="h-4 w-4" /> Change Image
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default StepItem
