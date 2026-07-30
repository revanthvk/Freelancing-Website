"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ArrowUp, X, FileText, Loader2, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Utils ───────────────────────────────────────────────────────────────── */
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface AttachedFile {
  id: string;
  file: File;
  type: string;
  preview: string | null;
  uploadStatus: string;
}

interface PastedSnippet {
  id: string;
  content: string;
  timestamp: Date;
}

/* ── File preview card ──────────────────────────────────────────────────── */
function FilePreviewCard({ file, onRemove }: { file: AttachedFile; onRemove: (id: string) => void }) {
  const isImage = file.type.startsWith("image/") && file.preview;

  return (
    <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] transition-colors hover:border-white/20">
      {isImage ? (
        <div className="relative h-full w-full">
          <img src={file.preview!} alt={file.file.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="rounded bg-white/[0.06] p-1.5">
              <FileText className="h-4 w-4 text-white/60" />
            </div>
            <span className="truncate text-[10px] font-medium uppercase tracking-wider text-white/40">
              {file.file.name.split(".").pop()}
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="truncate text-xs font-medium text-white/80" title={file.file.name}>
              {file.file.name}
            </p>
            <p className="text-[10px] text-white/30">{formatFileSize(file.file.size)}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>

      {file.uploadStatus === "uploading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

/* ── Pasted content card ────────────────────────────────────────────────── */
function PastedContentCard({ content, onRemove }: { content: PastedSnippet; onRemove: (id: string) => void }) {
  return (
    <div className="group relative flex h-24 w-28 shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
      <p className="line-clamp-4 select-none overflow-hidden whitespace-pre-wrap break-words font-mono text-[10px] leading-[1.4] text-white/40">
        {content.content}
      </p>
      <div className="mt-2 flex w-full items-center justify-between">
        <span className="inline-flex items-center justify-center rounded border border-white/[0.08] px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-wider text-white/40">
          Pasted
        </span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(content.id)}
        className="absolute right-2 top-2 rounded-full border border-white/[0.08] bg-black/60 p-[3px] text-white/50 opacity-0 shadow-sm transition-colors hover:text-white group-hover:opacity-100"
      >
        <X className="h-2 w-2" />
      </button>
    </div>
  );
}

/* ── Main chat input — no model selector, no thinking toggle ───────────── */
export interface ClaudeChatInputProps {
  onSendMessage: (message: string, files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function ClaudeChatInput({
  onSendMessage,
  placeholder = "How can I help you today?",
  disabled = false,
  className,
}: ClaudeChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedSnippet[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [message]);

  const handleFiles = useCallback((newFilesList: FileList | File[]) => {
    const newFiles: AttachedFile[] = Array.from(newFilesList).map((file) => {
      const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
      return {
        id: Math.random().toString(36).slice(2, 11),
        file,
        type: isImage ? "image/unknown" : file.type || "application/octet-stream",
        preview: isImage ? URL.createObjectURL(file) : null,
        uploadStatus: "uploading",
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((f) => {
      setTimeout(() => {
        setFiles((prev) => prev.map((p) => (p.id === f.id ? { ...p, uploadStatus: "complete" } : p)));
      }, 600 + Math.random() * 600);
    });
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      e.preventDefault();
      handleFiles(pastedFiles);
      return;
    }

    const text = e.clipboardData.getData("text");
    if (text.length > 300) {
      e.preventDefault();
      setPastedContent((prev) => [...prev, { id: Math.random().toString(36).slice(2, 11), content: text, timestamp: new Date() }]);
    }
  };

  function submit() {
    const text = message.trim();
    if (!text && files.length === 0 && pastedContent.length === 0) return;
    if (disabled) return;
    onSendMessage(text, files.map((f) => f.file));
    setMessage("");
    setFiles([]);
    setPastedContent([]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const hasContent = message.trim().length > 0 || files.length > 0 || pastedContent.length > 0;

  return (
    <div
      className={cn("relative w-full", className)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="relative z-10 flex flex-col rounded-2xl border border-white/[0.10] bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl transition-colors focus-within:border-white/20">
        <div className="flex flex-col gap-2 px-3 pb-2 pt-3">

          {/* Attachments row */}
          {(files.length > 0 || pastedContent.length > 0) && (
            <div className="flex gap-3 overflow-x-auto px-1 pb-2">
              {pastedContent.map((c) => (
                <PastedContentCard key={c.id} content={c} onRemove={(id) => setPastedContent((p) => p.filter((x) => x.id !== id))} />
              ))}
              {files.map((f) => (
                <FilePreviewCard key={f.id} file={f} onRemove={(id) => setFiles((p) => p.filter((x) => x.id !== id))} />
              ))}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="block w-full resize-none bg-transparent px-2 py-1.5 text-[15px] leading-relaxed text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
            style={{ minHeight: 28 }}
          />

          {/* Action bar */}
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Attach file"
            >
              <Plus className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={!hasContent || disabled}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition-all",
                hasContent && !disabled
                  ? "bg-white text-black hover:scale-105 active:scale-95"
                  : "cursor-not-allowed bg-white/[0.08] text-white/25",
              )}
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-400/50 bg-black/80 backdrop-blur-sm">
          <Archive className="mb-2 h-8 w-8 animate-bounce text-blue-400" />
          <p className="text-sm font-medium text-blue-300">Drop files to attach</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
