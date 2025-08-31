"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

type DropZoneProps = {
  onExtractedText: (text: string) => void;
};

export default function DropZone({ onExtractedText }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setErr("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/extract`,
        { method: "POST", body: fd }
      );
      const data = await res.json();

      if (res.ok && data.text) {
        onExtractedText(data.text);
      } else {
        setErr(data.error || "Failed to extract text. Try another file.");
        onExtractedText("");
      }
    } catch {
      setErr("Network error while extracting.");
      onExtractedText("");
    } finally {
      setBusy(false);
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer ${
        hover ? "bg-black/20" : "bg-white/20"
      } border-white`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        onFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      <p className="text-gray-200 font-mono">
        Drag & drop a PDF or image, or click to select
      </p>

      {busy && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-200">
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Extracting…
        </div>
      )}

      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
    </motion.div>
  );
}
