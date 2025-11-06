"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export type MediaFile = {
  id: number;
  src: string;
  type: "image" | "video";
  file: File;
};

interface FileUploadProps {
  onChange: (files: MediaFile[]) => void;
  error?: string;
}

export default function FileUpload({ onChange, error }: FileUploadProps) {
  const t = useTranslations("product");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: MediaFile[] = [];
    let errorMsg = "";

    if (mediaFiles.length + files.length > 5) {
      errorMsg = t("maxFiveFiles");
    } else {
      Array.from(files).forEach((file, idx) => {
        if (file.size > 5 * 1024 * 1024) {
          errorMsg = t("fileTooLarge");
        } else {
          validFiles.push({
            id: Date.now() + idx,
            src: URL.createObjectURL(file),
            type: file.type.startsWith("video") ? "video" : "image",
            file,
          });
        }
      });
    }

    if (errorMsg) {
      alert(errorMsg);
      e.target.value = "";
      return;
    }

    const updated = [...mediaFiles, ...validFiles];
    setMediaFiles(updated);
    onChange(updated);
    e.target.value = "";
  };

  const handleRemove = (id: number) => {
    const updated = mediaFiles.filter((m) => m.id !== id);
    setMediaFiles(updated);
    onChange(updated);
  };

  return (
    <div>
      <div
        className="w-full border-2 border-dashed border-black rounded-lg py-5 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <label className="text-[14px] font-[400] underline text-[#697586] mb-1">
          {t("uploadPhotoOrVideo")}
        </label>
        <p className="text-[12px] font-[400] text-[#9AA4B2]">
          {t("jpegPngMovAndAviMax5Files")}
        </p>
        <Input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.mov,.avi,.mp4"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {mediaFiles.length > 0 && (
        <div className="mt-2 w-full">
          <div className="w-full overflow-x-auto py-2">
            <div className="flex gap-2 min-w-max">
              {mediaFiles.map((m) => (
                <div
                  key={m.id}
                  className="relative w-16 h-16 flex-shrink-0 rounded-[4px] overflow-hidden"
                >
                  {m.type === "image" ? (
                    <Image
                      src={m.src}
                      alt="uploaded"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <video src={m.src} className="object-cover w-full h-full" />
                  )}
                  <div
                    className="absolute top-1 right-1 w-3 h-3 cursor-pointer z-10"
                    onClick={() => handleRemove(m.id)}
                  >
                    <Image
                      src="/icons/trash.svg"
                      alt="remove"
                      width={12}
                      height={12}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
