import { useState } from 'react'
import { X } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import StepItem, { type Step } from './StepItem'
import StepAdd from './StepAdd'

function ProcessEditor() {
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', title: 'Patient Registration', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60' },
    { id: '2', title: 'Triage Assessment', imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&auto=format&fit=crop&q=60' }
  ])

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px movement before dragging starts (allows clicking inputs)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addStep = (imageUrl: string) => {
    const newStep: Step = {
      id: crypto.randomUUID(),
      title: '',
      imageUrl
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id: string, updates: Partial<Step>) => {
    setSteps(steps.map(step => step.id === id ? { ...step, ...updates } : step))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4 mb-6">
          <SortableContext
            items={steps.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {steps.map(step => (
              <StepItem 
                key={step.id} 
                step={step} 
                onUpdate={updateStep}
                onRemove={removeStep}
                onPreview={setPreviewUrl}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <StepAdd onAdd={addStep} />

      {/* Image Preview Modal */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setPreviewUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md"
            onClick={(e) => {
              e.stopPropagation()
              setPreviewUrl(null)
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </div>
  )
}

export default ProcessEditor
