import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  variant?: 'compact' | 'full';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, variant = 'compact' }) => {
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (variant === 'full') {
    return (
      <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Foto Impian (Opsional)
        </label>
        {value ? (
          <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 group">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium text-sm px-4 py-2 bg-neutral-900/80 rounded-full backdrop-blur-sm">Ganti Foto</span>
            </div>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        ) : (
          <div className="h-40 w-full rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors flex flex-col items-center justify-center relative">
            <ImageIcon className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mb-2" />
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Pilih atau letakkan foto</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">Maks. 2MB</span>
            <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
        Gambar (Opsional, max 2MB)
      </label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFile}
        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-900/30 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/50 cursor-pointer"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {value && (
        <div className="mt-2 h-32 w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};
