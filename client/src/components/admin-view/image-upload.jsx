import { useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

function ProductImageUpload({ imageFile, setImageFile }) {
  const inputRef = useRef(null);
  function handleImageFileChange(e) {
    const selectedFiles = e.target.files[0];
    if (selectedFiles) setImageFile(selectedFiles);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleDrop(e) {
    e.preventDefault();
    console.log(e);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }
  function handleRemoveImage(e) {
    e.preventDefault();
    setImageFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }
  return (
    <div className="mx-auto w-full max-w-md">
      <Label className="mb-2 block text-lg font-semibold">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="rounded-lg border-2 border-dashed p-4"
      >
        <Input
          onChange={handleImageFileChange}
          ref={inputRef}
          id="image-upload"
          type="file"
          className="hidden"
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex h-32 cursor-pointer flex-col items-center justify-center"
          >
            <UploadCloudIcon className="mb-2 h-10 w-10 text-muted-foreground" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="mr-2 h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium">
              {imageFile?.name ||
                imageFile.match(/images\/([^_]+)_/)[1] +
                  "." +
                  imageFile.split(".")[1]}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
