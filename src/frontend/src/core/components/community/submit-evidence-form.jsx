import { useState } from "react";
import { FileText, Upload, X, Plus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import { useToast } from "@/core/hooks/use-toast";

export function SubmitEvidenceForm({ onSubmit }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Check file size (5MB limit per file)
    const oversizedFiles = selectedFiles.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Some files exceed the 5MB size limit: ${oversizedFiles.map((f) => f.name).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Add files to the list
    const newFiles = selectedFiles.map((file) => ({
      file,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "document",
      size: formatFileSize(file.size),
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));

    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim() === "" && files.length === 0) {
      toast({
        title: "Submission incomplete",
        description: "Please provide a description or upload files as evidence.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        description,
        files,
      });

      toast({
        title: "Evidence submitted",
        description: "Your evidence has been submitted successfully and is pending review.",
      });

      // Clean up file previews
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your evidence. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your participation and the evidence you're providing..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        <p className="text-sm text-muted-foreground">Explain what you did, when you did it, and how it relates to the project requirements.</p>
      </div>

      <div className="space-y-2">
        <Label>Evidence Files</Label>

        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                {file.preview ? (
                  <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                    <img src={file.preview || "/placeholder.svg"} alt={file.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <FileText className="h-10 w-10 p-2 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.size}</div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <Input id="evidence-files" type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx,.txt,.csv" />
          <div className="py-4">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Drag and drop files, or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">Supports images, PDFs, documents, and text files (max 5MB each)</p>
            <Button type="button" variant="outline" onClick={() => document.getElementById("evidence-files").click()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Evidence"}
        </Button>
      </div>
    </form>
  );
}
