'use client';
import { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Link, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageManager({ images, onChange }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = images.filter(Boolean);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      fileArray.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Upload failed');
        return;
      }

      onChange([...filtered, ...data.urls]);
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [filtered, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }, [uploadFiles]);

  const handleRemove = (index: number) => {
    onChange(filtered.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    onChange([...filtered, trimmed]);
    setUrlValue('');
    setShowUrlInput(false);
  };

  // Thumbnail reorder via drag
  const handleThumbDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleThumbDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleThumbDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const reordered = [...filtered];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    onChange(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleThumbDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="md:col-span-2 space-y-3">
      <label className="block text-sm text-muted mb-1">Images</label>

      {/* Thumbnail grid */}
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtered.map((src, i) => (
            <div
              key={`${src}-${i}`}
              draggable
              onDragStart={() => handleThumbDragStart(i)}
              onDragOver={(e) => handleThumbDragOver(e, i)}
              onDrop={(e) => handleThumbDrop(e, i)}
              onDragEnd={handleThumbDragEnd}
              className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                dragOverIndex === i ? 'border-primary scale-105' : i === 0 ? 'border-primary/50' : 'border-[#333]'
              } ${dragIndex === i ? 'opacity-40' : ''}`}
            >
              <Image
                src={src}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              {/* MAIN badge */}
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  MAIN
                </span>
              )}
              {/* Grip handle */}
              <div className="absolute bottom-1 left-1 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-[#333] hover:border-[#555] hover:bg-[#1a1a1a]'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted">
            <Upload size={24} />
            <span className="text-sm">Drop files here or click to browse</span>
            <span className="text-xs">JPEG, PNG, WebP, GIF up to 5MB</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* URL input toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-muted hover:text-white flex items-center gap-1 transition-colors"
        >
          <Link size={12} />
          {showUrlInput ? 'Hide URL input' : 'Add image by URL'}
        </button>
        {showUrlInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
              placeholder="https://..."
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
