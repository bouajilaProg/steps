import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Menu } from '@base-ui/react/menu'
import { Drawer } from '@base-ui/react/drawer'
import { buttonVariants } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

interface WorkflowActionsMenuProps {
  onRename: () => void
  onDelete: () => void
}

export default function WorkflowActionsMenu({ onRename, onDelete }: WorkflowActionsMenuProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return <DesktopMenu onRename={onRename} onDelete={onDelete} />
  }

  return <MobileDrawer onRename={onRename} onDelete={onDelete} />
}

function DesktopMenu({ onRename, onDelete }: WorkflowActionsMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        className={buttonVariants({ variant: 'secondary', size: 'icon' })}
        aria-label="Workflow actions"
      >
        <MoreVertical className="h-4 w-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="z-50">
          <Menu.Popup className="min-w-[10rem] origin-(--transform-origin) rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95 data-[closed]:animate-out data-[closed]:fade-out-0 data-[closed]:zoom-out-95">
            <Menu.Item
              onClick={onRename}
              className={cn(
                'flex cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none select-none',
                'data-[highlighted]:bg-muted data-[highlighted]:text-foreground'
              )}
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Rename
            </Menu.Item>
            <Menu.Item
              onClick={onDelete}
              className={cn(
                'flex cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none select-none text-destructive',
                'data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive'
              )}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function MobileDrawer({ onRename, onDelete }: WorkflowActionsMenuProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger
        className={buttonVariants({ variant: 'secondary', size: 'icon' })}
        aria-label="Workflow actions"
      >
        <MoreVertical className="h-4 w-4" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[open]:animate-in data-[open]:fade-in-0 data-[closed]:animate-out data-[closed]:fade-out-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end justify-center">
          <Drawer.Popup className="w-full max-w-lg rounded-t-2xl border bg-background p-4 pb-6 shadow-lg outline-none data-[open]:animate-in data-[open]:slide-in-from-bottom-full data-[open]:duration-300 data-[closed]:animate-out data-[closed]:slide-out-to-bottom-full data-[closed]:duration-200">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" />
            <Drawer.Title className="sr-only">Workflow actions</Drawer.Title>
            <Drawer.Description className="sr-only">
              Choose an action for this workflow
            </Drawer.Description>
            <div className="flex flex-col gap-1">
              <Drawer.Close
                type="button"
                onClick={onRename}
                className="flex items-center gap-3 rounded-lg px-4 py-3.5 text-left text-sm font-medium hover:bg-muted transition-colors"
              >
                <Pencil className="h-5 w-5 text-muted-foreground" />
                Rename
              </Drawer.Close>
              <Drawer.Close
                type="button"
                onClick={onDelete}
                className="flex items-center gap-3 rounded-lg px-4 py-3.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </Drawer.Close>
            </div>
            <Drawer.Close
              type="button"
              className="mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </Drawer.Close>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
