

import { useState } from "react"
import { AlertTriangle, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Label } from "@/core/components/ui/label"
import { useToast } from "@/core/hooks/use-toast"

export function DeleteProjectModal({ project, onDelete, trigger }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const { toast } = useToast()

  const handleDelete = async () => {
    if (confirmText !== project.title) {
      toast({
        title: "Confirmation failed",
        description: "Please type the project title exactly to confirm deletion.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      // In a real app, this would be an API call to delete the project
      // For demo purposes, we'll simulate a successful deletion
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })

      setIsOpen(false)
      if (onDelete) onDelete(project.id)
    } catch (error) {
      toast({
        title: "Failed to delete project",
        description: "There was an error deleting the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Project</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project and all associated data, including
            participant submissions and rewards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <h4 className="font-medium mb-2">You are about to delete:</h4>
            <p className="font-semibold">{project.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {project.participants} participants • {project.reward} LUM tokens allocated
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              To confirm, type <span className="font-semibold">{project.title}</span> below:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${project.title}" to confirm`}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || confirmText !== project.title}>
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
