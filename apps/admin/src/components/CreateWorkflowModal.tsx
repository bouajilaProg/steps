import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isSubmitting?: boolean;
}

export function CreateWorkflowModal({ isOpen, onClose, onSubmit, isSubmitting }: CreateWorkflowModalProps) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-background border rounded-xl shadow-lg w-[400px] max-w-[90vw] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <h2 className="text-xl font-semibold tracking-tight">Create Workflow</h2>
            <p className="text-sm text-muted-foreground mt-1.5 mb-5">
              Enter a title for your new workflow guide.
            </p>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none">
                Workflow Name
              </label>
              <Input
                id="title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Blood Donation Protocol"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="px-6 py-4 bg-muted/50 flex justify-end gap-3 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
