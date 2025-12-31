"use client";
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { getCurrentLocation } from "../lib/utils";
import { usePublishIssue } from "../hooks/use-issue";

const ReportIssueDialog = () => {
  const {mutate,isPending,error:publishError,status:success} = usePublishIssue()


  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(publishError?.message||null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  useEffect(() => {
    if (success === "success") {
      const timeoutId = setTimeout(resetForm, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    previews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setPreviews([]);
    setLoading(false);
    setError(null);
    formRef.current?.reset?.();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const updatedFiles = [...imageFiles, ...newFiles].slice(0, 4);
    
    previews.forEach((url) => URL.revokeObjectURL(url));
    
    setImageFiles(updatedFiles);
    setPreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };
  const removeImage = (idx: number) => {

    URL.revokeObjectURL(previews[idx]);
    
    const newFiles = [...imageFiles];
    const newPreviews = [...previews];
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };
  const handlePreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const submitForm = new FormData(formRef.current!);
      submitForm.set("title", title);
      submitForm.set("description", description);
      const currentLocation = await getCurrentLocation();
      submitForm.set("location", currentLocation);

      const existingImages = submitForm.getAll("images") ?? [];
      existingImages.forEach(() => submitForm.delete("images"));

      imageFiles.forEach((file) => {
        submitForm.append("images", file);
      });

   mutate(submitForm);


    } catch (err: any) {
      setError(
        err?.message ||
          "An error occurred while submitting the issue. Please try again."
      );
    } 
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-background">Report New Issue +</Button>
      </DialogTrigger>

      <DialogContent className="max-h-dvh mt-5 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report New Issue</DialogTitle>
          <DialogDescription>
            Fill out the details below to report a new issue. Please provide as
            much information as possible and upload relevant images to help us
            address your concern quickly.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form
          className="space-y-6"
          ref={formRef}
          autoComplete="off"
          onSubmit={handlePreSubmit}
        >
          <div>
            <Label className="py-1">Name of Issue:</Label>
            <Input
              name="title"
              placeholder="Broken Window..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label className="py-1">Describe issue...</Label>
            <Textarea
              name="description"
              placeholder="Explain issue in detail..."
              className="min-h-[160px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoComplete="off"
            />
            <div className="space-y-2 mt-4">
              <Label>Upload Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className=""
              />
              {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {previews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative h-28 w-36 overflow-hidden rounded-lg border group"
                    >
                      <Image
                        src={preview}
                        alt={`Issue preview ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 rounded-full bg-black/60 text-white w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="text-red-500 px-2 py-1 rounded bg-red-50 border mt-2">
              {error}
            </div>
          )}
          {success==="success" && (
            <div className="text-green-600 px-2 py-1 rounded bg-green-50 border mt-2">
              Issue submitted successfully!
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={resetForm}
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueDialog;
