import { useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import { UploadCloud, File, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
}

export default function ResumeUpload({
  onUploadSuccess,
}: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      setError(null);

      await axios.post(
        `${API_BASE_URL}coach/uploadresume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        onUploadSuccess?.();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center animate-in fade-in zoom-in duration-300">
        <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <p className="font-semibold text-emerald-500">Resume Uploaded Successfully!</p>
        <p className="text-xs text-emerald-500/80 mt-1">Ready for ATS and AI review.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 bg-card/20 hover:bg-card/40 border-border/60 hover:border-primary/50">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={loading}
        />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none text-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Click or drag PDF to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Supported format: .pdf (Max 5MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full max-w-sm p-3 bg-muted/40 border border-border/50 rounded-lg z-10">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0">
                <File className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              disabled={loading}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <p>{error}</p>
        </div>
      )}

      {file && !success && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={upload}
            disabled={loading}
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Uploading...
              </span>
            ) : (
              "Confirm Upload"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}