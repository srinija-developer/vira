'use client';
import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';

type Platform = 'Instagram' | 'LinkedIn' | 'X/Twitter' | 'Facebook' | 'General';
type ContentType = 'Post' | 'Caption' | 'Advertisement' | 'Announcement' | 'Marketing Content' | 'Other';

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  status: 'idle' | 'uploading' | 'done' | 'error';
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

const platforms: Platform[] = ['Instagram', 'LinkedIn', 'X/Twitter', 'Facebook', 'General'];
const contentTypes: ContentType[] = ['Post', 'Caption', 'Advertisement', 'Announcement', 'Marketing Content', 'Other'];

const platformIcons: Record<Platform, string> = {
  Instagram: 'CameraIcon',
  LinkedIn: 'BriefcaseIcon',
  'X/Twitter': 'ChatBubbleLeftRightIcon',
  Facebook: 'UserGroupIcon',
  General: 'GlobeAltIcon',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadStudio() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [platform, setPlatform] = useState<Platform>('LinkedIn');
  const [contentType, setContentType] = useState<ContentType>('Post');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type: ${file.type || 'unknown'}. Please upload a PDF, PNG, or JPG.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${formatFileSize(file.size)}. Maximum size is 10 MB.`;
    }
    return null;
  };

  const processFile = useCallback((file: File) => {
    setGlobalError(null);
    const error = validateFile(file);
    if (error) {
      setGlobalError(error);
      return;
    }

    const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

    setUploadedFile({ file, preview, progress: 0, status: 'uploading' });

    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 25 + 10;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setUploadedFile((prev) => prev ? { ...prev, progress: 100, status: 'done' } : null);
      } else {
        setUploadedFile((prev) => prev ? { ...prev, progress: Math.floor(prog) } : null);
      }
    }, 200);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
    setUploadedFile(null);
    setGlobalError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!uploadedFile || uploadedFile.status !== 'done') return;
    setIsSubmitting(true);

    // Backend integration point: POST /api/upload with file, platform, contentType
    // Then POST /api/extract for PDF or POST /api/ocr for images
    // Then navigate to /processing-screen with the analysis ID

    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    router.push('/processing-screen');
  };

  const fileType = uploadedFile?.file.type === 'application/pdf' ? 'PDF' : 'Image';

  return (
    <div className="space-y-6">
      {/* Global error */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 bg-negative/10 border border-negative/30 rounded-xl px-4 py-3"
          >
            <Icon name="ExclamationTriangleIcon" size={18} className="text-negative flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-negative">Upload Failed</p>
              <p className="text-xs text-negative/80 mt-0.5">{globalError}</p>
            </div>
            <button onClick={() => setGlobalError(null)} className="text-negative/60 hover:text-negative transition-colors">
              <Icon name="XMarkIcon" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 cursor-pointer ${
              isDragOver
                ? 'upload-zone-active' :'border-border hover:border-primary/40 hover:bg-primary/3'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileInput}
              aria-label="Upload content file"
            />

            <motion.div
              animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-200 ${
                isDragOver ? 'bg-primary/20 glow-violet' : 'bg-muted'
              }`}>
                <Icon
                  name="CloudArrowUpIcon"
                  size={36}
                  className={isDragOver ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>

              <div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {isDragOver ? 'Drop it here!' : 'Drop your content here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, PNG, JPG, JPEG · Max 10 MB
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-border" />
                <span className="text-xs text-muted-foreground font-medium">or</span>
                <div className="h-px w-12 bg-border" />
              </div>

              <span className="btn-secondary text-sm px-6 py-2.5 pointer-events-none">
                Browse Files
              </span>
            </motion.div>

            {/* Format badges */}
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              {[
                { label: 'PDF', icon: 'DocumentTextIcon', color: 'text-primary' },
                { label: 'PNG', icon: 'PhotoIcon', color: 'text-accent' },
                { label: 'JPG', icon: 'PhotoIcon', color: 'text-accent' },
                { label: 'JPEG', icon: 'PhotoIcon', color: 'text-accent' },
              ].map((fmt) => (
                <span
                  key={`fmt-${fmt.label}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full"
                >
                  <Icon name={fmt.icon as Parameters<typeof Icon>[0]['name']} size={12} className={fmt.color} />
                  {fmt.label}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-start gap-4">
              {/* File icon / preview */}
              <div className="flex-shrink-0">
                {uploadedFile.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadedFile.preview}
                    alt={`Preview of ${uploadedFile.file.name}`}
                    className="w-16 h-16 rounded-xl object-cover border border-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon name="DocumentTextIcon" size={28} className="text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-foreground truncate">{uploadedFile.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.file.size)}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs font-semibold text-primary">{fileType}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-negative hover:bg-negative/10 transition-colors flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <Icon name="XMarkIcon" size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs font-medium text-muted-foreground">
                      {uploadedFile.status === 'done' ? 'Ready to analyze' : 'Uploading...'}
                    </span>
                    <span className="text-2xs font-bold font-tabular text-primary">
                      {uploadedFile.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      animate={{ width: `${uploadedFile.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {uploadedFile.status === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 mt-2"
                  >
                    <Icon name="CheckCircleIcon" size={14} className="text-positive" />
                    <span className="text-xs font-semibold text-positive">File ready for analysis</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platform Selector */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Target Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={`platform-${p}`}
              onClick={() => setPlatform(p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 active:scale-95 ${
                platform === p
                  ? 'bg-primary/10 border-primary/40 text-primary' :'bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon
                name={platformIcons[p] as Parameters<typeof Icon>[0]['name']}
                size={14}
                className={platform === p ? 'text-primary' : 'text-muted-foreground'}
              />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Content Type
        </label>
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((ct) => (
            <button
              key={`content-type-${ct}`}
              onClick={() => setContentType(ct)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 active:scale-95 ${
                contentType === ct
                  ? 'bg-accent/10 border-accent/40 text-accent' :'bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {ct}
            </button>
          ))}
        </div>
      </div>

      {/* OCR Note for images */}
      {uploadedFile && fileType === 'Image' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3"
        >
          <Icon name="EyeIcon" size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-accent">OCR Processing Enabled</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              VIRA will preprocess your image (contrast, resize, noise reduction) and extract text using Tesseract OCR. You can edit the extracted text before analysis.
            </p>
          </div>
        </motion.div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!uploadedFile || uploadedFile.status !== 'done' || isSubmitting}
        className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isSubmitting ? (
          <>
            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
            Preparing analysis...
          </>
        ) : (
          <>
            <Icon name="SparklesIcon" size={18} />
            Analyze Content
            <Icon name="ArrowRightIcon" size={16} />
          </>
        )}
      </button>

      {!uploadedFile && (
        <p className="text-center text-xs text-muted-foreground">
          Upload a file to enable analysis · Supports PDF, PNG, JPG, JPEG · Max 10 MB
        </p>
      )}
    </div>
  );
}