"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Podcast } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";

interface FilePreview {
  file: Blob;
  preview: string;
}

export default function ImageUploadPlaceholder() {
  const [file, setFile] = useState<FilePreview | null>();
  const [fileToProcess, setFileToProcess] = useState<{
    path: string;
  } | null>(null);

  const [restoreFile, setRestoreFile] = useState<FilePreview | null>()

  const onDrop = useCallback(async (acceptFiles: File[]) => {
    try {
      const file = acceptFiles[0];
      setFile({
        file,
        preview: URL.createObjectURL(file),
      });
    } catch (error) {
      console.log("onDrop", error)
    }
  }, []);

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview)
      if (restoreFile) URL.revokeObjectURL(restoreFile.preview)
    };
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    }
  })

  const handleDialogOpenChange = async (e: boolean) => {
    console.log(e)
  }
  return (
    <div className="flex h-[200px] w-full shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Podcast className="h-10 w-10 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">Just add a Photo</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          The photo you add will be enhanced by IA
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="relative">
              Bring your past to life
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Photo</DialogTitle>
              <DialogDescription>
                Drag a photo in order to Upload & Enhance
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                {!file && (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="flex items-center justify-center bg-blue-100 opacity-70 border border-dashed border-blue-300 p-6 h-36 rounded-md">
                        Drop your Photo here...</p>
                    ) : (
                      <p className="flex items-center justify-center bg-blue-100 opacity-70 border border-dashed border-blue-300 p-6 h-36 rounded-md">
                        Drag or Click to choose image...</p>
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center justify-evenly sm:flex-row gap-2">
                  {
                    file && (
                      <div className="flex flex-row flex-wrap drop-shadow-md">
                        <div className="flex w-48 h-48 relative">

                          <img src={file.preview} className="w-48 h-48 object-contain rounded-md"
                            onClick={() => URL.revokeObjectURL(file.preview)}
                            alt="" />
                        </div>
                      </div>
                    )
                  }

                  {
                    restoreFile && (
                      <div className="flex flex-row flex-wrap drop-shadow-md">
                        <div className="flex w-72 h-7w-72 relative">

                          <img src={restoreFile.preview} className="w-72 h-7w-72 object-contain rounded-md"
                            onClick={() => URL.revokeObjectURL(restoreFile.preview)}
                            alt="" />
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button>Enhance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div >
  );
}
