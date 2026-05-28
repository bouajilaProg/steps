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
  index: number
  onUpdate: (id: string, updates: Partial<Step>) => void
  onRemove: (id: string) => void
  onPreview: (url: string) => void
}

function StepItem({ step, index, onUpdate, onRemove, onPreview }: StepItemProps) {
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
    transform: CSS.Translate.toString(transform),
    transition,
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
      className={`group/item relative flex flex-col bg-white rounded-2xl border transition-[box-shadow,border-color,opacity] duration-200 ${
        isDragging ? 'border-indigo-500 shadow-2xl opacity-90 z-50' : 'border-slate-200 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:border-slate-300'
      } overflow-hidden`}
    >
      {/* Top Image Section */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden group/img flex-shrink-0">
        
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="absolute top-3 left-3 z-10 p-1.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg shadow-sm cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-700 transition-colors border border-slate-200/50"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Number Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/95 text-white font-bold text-sm shadow-sm backdrop-blur-md border border-indigo-500/50">
          {index + 1}
        </div>

        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-indigo-500 bg-slate-50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm font-medium">Updating...</span>
          </div>
        ) : (
          <>
            <img src={step.imageUrl} alt={step.title || 'Step reference'} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => onPreview(step.imageUrl)}
                className="p-2.5 text-slate-700 bg-white/90 hover:bg-white border border-white/50 rounded-xl backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                title="Preview Image"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-white bg-indigo-600/90 hover:bg-indigo-600 border border-indigo-500/50 rounded-xl backdrop-blur-md transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                title="Replace Image"
              >
                <Upload className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Content Section */}
      <div className="p-4 flex items-center gap-3 bg-white">
        <input
          type="text"
          value={step.title}
          onChange={(e) => onUpdate(step.id, { title: e.target.value })}
          placeholder="Step Title..."
          className="w-full text-base font-semibold text-slate-800 border-0 border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:ring-0 px-1 py-1 bg-transparent transition-colors placeholder:text-slate-400"
        />
        <button
          onClick={() => onRemove(step.id)}
          className="flex-shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl p-2 transition-all opacity-0 group-hover/item:opacity-100 focus:opacity-100"
          title="Remove step"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default StepItem
