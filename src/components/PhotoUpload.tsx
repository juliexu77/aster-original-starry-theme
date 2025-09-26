import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  currentPhotoUrl?: string | null;
  bucketName: string;
  folder: string;
  fallbackIcon?: React.ReactNode;
  onPhotoUpdate: (photoUrl: string | null) => void;
  size?: "sm" | "md" | "lg";
}

export function PhotoUpload({
  currentPhotoUrl,
  bucketName,
  folder,
  fallbackIcon,
  onPhotoUpdate,
  size = "md"
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      onPhotoUpdate(publicUrl);
      
      toast({
        title: "Photo uploaded!",
        description: "Your photo has been updated successfully."
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async () => {
    if (!currentPhotoUrl) return;
    
    setDeleting(true);
    try {
      // Extract file path from URL
      const urlParts = currentPhotoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${folder}/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;

      onPhotoUpdate(null);
      
      toast({
        title: "Photo deleted",
        description: "Your photo has been removed."
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Delete failed", 
        description: "Failed to delete photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    uploadPhoto(file);
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={currentPhotoUrl || undefined} 
          alt="Profile photo" 
          className="object-cover"
        />
        <AvatarFallback className="bg-muted">
          {fallbackIcon || <Camera className="w-6 h-6 text-muted-foreground" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Upload className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Camera className="w-4 h-4 mr-2" />
          )}
          {currentPhotoUrl ? "Change" : "Upload"}
        </Button>

        {currentPhotoUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={deletePhoto}
            disabled={deleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}