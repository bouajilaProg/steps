import { useState, useEffect } from 'react'
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
  arraySwap,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSwappingStrategy,
} from '@dnd-kit/sortable'

import StepItem, { type Step } from './StepItem'
import StepAdd from './StepAdd'

interface ProcessEditorProps {
  steps: Step[]
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>
}

function ProcessEditor({ steps, setSteps }: ProcessEditorProps) {

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewUrl(null)
      }
    }

    if (previewUrl) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewUrl])

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

        return arraySwap(items, oldIndex, newIndex)
      })
    }
  }

  const addStep = (imageUrl: string, file: File) => {
    const newStep: Step = {
      id: crypto.randomUUID(),
      title: '',
      imageUrl,
      file,
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
    <div className="max-w-7xl mx-auto w-full pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 items-start auto-rows-max">
          <SortableContext
            items={steps.map(s => s.id)}
            strategy={rectSwappingStrategy}
          >
            {steps.map((step, index) => (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                onUpdate={updateStep}
                onRemove={removeStep}
                onPreview={setPreviewUrl}
              />
            ))}
          </SortableContext>
          <StepAdd onAdd={addStep} />
        </div>
      </DndContext>

      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-4 md:p-8 backdrop-blur-sm transition-opacity"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all bg-white/10 hover:bg-white/20 hover:scale-105 p-3 rounded-full backdrop-blur-md"
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
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </div>
  )
}

export default ProcessEditor
