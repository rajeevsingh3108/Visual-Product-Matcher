import { Upload, Image as ImageIcon, Search, Sparkles, Camera, Zap } from 'lucide-react';
import React from 'react';

export type UploadFormProps = {
  image: string | null;
  setImage: (img: string | null) => void;
  setDominantColor: (color: string | null) => void;
  setFile: (file: File | null) => void;
  analyzed: boolean;
  inferredColor: string | null;
  inferredCategory: string | null;
  inferredName: string;
  onAnalyze?: () => void;
  onSearch: () => void;
  onSave: () => void;
  analyzing?: boolean;
};

const UploadForm: React.FC<UploadFormProps> = (props) => {
  const {
    image, setImage, setDominantColor, setFile,
    analyzed, inferredColor, inferredCategory, inferredName,
    onAnalyze, onSearch, onSave, analyzing
  } = props;

  const extractDominantColor = (src: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        const step = 10 * 4;
        for (let i = 0; i < data.length; i += step) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setDominantColor(
            `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
          );
        }
      };
      img.onerror = () => setDominantColor(null);
      img.src = src;
    } catch {
      setDominantColor(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setImage(dataUrl);
        extractDominantColor(dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (!url) {
      setImage(null);
      return;
    }

    // show something immediately while we fetch a CORS-safe copy
    setImage(url);

    fetch('/api/fetch-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        // IMPORTANT: use dataUrl for preview so it works in production
        if (data?.dataUrl) {
          setImage(data.dataUrl);
          extractDominantColor(data.dataUrl);
        } else {
          // fall back to original URL if backend didn’t convert
          extractDominantColor(url);
        }
      })
      .catch(() => {
        // fall back gracefully
        extractDominantColor(url);
      });
  };

  const [imgError, setImgError] = React.useState<string | null>(null);

  return (
    <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-lg overflow-hidden">
      {/* glass card */}
      <div className="relative rounded-[calc(theme(borderRadius.3xl)-2px)] border border-white/40 bg-white/70 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-rose-300/40 via-fuchsia-300/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-gradient-to-tr from-indigo-300/30 via-cyan-300/30 to-transparent blur-3xl" />
        {/* fine beams */}
        <div className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/60 to-transparent" />
        <div className="pointer-events-none absolute left-14 right-14 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />

        {/* Header */}
        <div className="relative z-10 mb-8 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2">
            <span className="inline-grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Camera className="h-5 w-5 text-indigo-600" />
            </span>
            <span className="inline-grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-rose-600" />
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#0f172a,#334155)] dark:bg-[linear-gradient(90deg,#e2e8f0,#94a3b8)]">
              Upload &amp; Discover
            </span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Share your product photo and find similar items instantly
          </p>
        </div>

        {/* Upload Section */}
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* File Upload */}
            <label className="group relative cursor-pointer">
              <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 transition-transform group-hover:scale-[1.01]">
                <div className="flex items-center gap-3 rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/60 bg-white/75 px-6 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                  <div className="rounded-xl border border-white/60 bg-white/80 p-2 shadow-sm backdrop-blur transition-colors group-hover:bg-white">
                    <Upload className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-semibold text-slate-800 dark:text-slate-100">Choose File</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG, WebP</span>
                  </div>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {/* URL Input */}
            <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400">
              <div className="group flex items-center gap-3 rounded-[calc(theme(borderRadius.2xl)-2px)] border border-white/60 bg-white/75 px-6 py-4 shadow-sm backdrop-blur transition-[background] dark:border-white/10 dark:bg-slate-900/60">
                <div className="rounded-xl border border-white/60 bg-white/80 p-2 shadow-sm backdrop-blur transition-colors group-hover:bg-white">
                  <ImageIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="Or paste an image URL..."
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100"
                    // show URL string if it's http(s); blank when we switch to dataUrl
                    value={image && image.startsWith('http') ? image : ''}
                    onChange={handleUrlChange}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">From anywhere on the web</span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {image && (
  <div className="mt-6 text-center">
    <div className="relative inline-block">
      <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-rose-400 via-indigo-400 to-emerald-400 shadow-md">
        {/* card */}
        <div className="relative overflow-hidden rounded-[calc(theme(borderRadius.2xl)-2px)] border-4 border-white/60 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          {/* put overlay BEHIND the image (z-0) */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

          {/* image ABOVE overlay (z-10) */}
          <img
            src={image}
            alt="Preview"
            className="relative z-10 block h-56 w-auto max-w-full bg-slate-50 object-contain mx-auto"
            referrerPolicy="no-referrer"
            onLoad={() => setImgError(null)}
            onError={() => setImgError('Could not load the image (blocked or invalid). Try a different URL or upload the file.')}
          />
        </div>
      </div>

      {/* Floating analysis indicator */}
      {analyzed && (
        <div className="absolute -right-3 -top-3 rounded-full bg-emerald-500 p-2 text-white shadow-lg">
          <Zap className="h-4 w-4" />
        </div>
      )}
    </div>

    {imgError && (
      <p className="mt-3 text-xs font-medium text-rose-600 dark:text-rose-400">
        {imgError}
      </p>
    )}
              {/* Analysis Results */}
              {analyzed && (
                <div className="mt-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                  <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-extrabold">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-500">
                      AI Analysis Results
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Product Name</span>
                      </div>
                      <p className="rounded-lg bg-slate-50 px-3 py-2 font-medium text-slate-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {inferredName || 'Unknown'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Category</span>
                      </div>
                      <p className="rounded-lg bg-slate-50 px-3 py-2 font-medium capitalize text-slate-900 dark:bg-slate-800/60 dark:text-slate-100">
                        {inferredCategory || 'Uncategorized'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dominant Color</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                        {inferredColor && (
                          <span
                            className="h-6 w-6 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200"
                            style={{ backgroundColor: inferredColor }}
                          />
                        )}
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {inferredColor || 'Not detected'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {onAnalyze && (
              <button
                className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-3 text-sm font-semibold shadow-lg transition-all
                  ${analyzing
                    ? 'cursor-not-allowed bg-slate-400 text-white'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                  }`}
                onClick={onAnalyze}
                disabled={!image || analyzing}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-white" />
                {analyzing ? (
                  <>
                    <span className="relative inline-block h-4 w-4">
                      <span
                        className="absolute inset-0 animate-spin rounded-full"
                        style={{
                          background:
                            'conic-gradient(#f43f5e,#a855f7,#6366f1,#06b6d4,#22c55e,#f59e0b,#f43f5e)',
                          mask:
                            'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                          WebkitMask:
                            'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
                          animationDuration: '1.1s',
                        }}
                      />
                    </span>
                    <span>Analyzing Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            )}

            <button
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-3 text-sm font-semibold shadow-lg transition-all
                ${
                  !image || !analyzed
                    ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 hover:scale-105 hover:shadow-xl'
                }`}
              onClick={onSearch}
              disabled={!image || !analyzed}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-white" />
              <Search className="h-4 w-4" />
              <span>Find Matches</span>
            </button>

            <button
              className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-3 text-sm font-semibold shadow-lg transition-all
                ${
                  !image || !analyzed
                    ? 'cursor-not-allowed bg-slate-300 text-slate-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:scale-105 hover:shadow-xl'
                }`}
              onClick={onSave}
              disabled={!image || !analyzed}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-white" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-white border-r-transparent" />
                <span>Save to Catalog</span>
              </div>
            </button>
          </div>

          {/* Helper Text */}
          {!image && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                👆 Start by uploading an image or pasting a URL to begin the magic
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
