import React from 'react';
import { GeneratedImage } from '../types';

interface ImageViewerProps {
  image: GeneratedImage;
  onClose: () => void;
  onRemix: (prompt: string) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onRemix }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `soulpaper-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = () => {
    onClose();
    onRemix(image.prompt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col justify-center items-center backdrop-blur-sm animate-fade-in">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Image */}
      <div className="relative w-full h-full max-w-md max-h-[85vh] p-4 flex items-center justify-center">
        <img 
          src={image.dataUrl} 
          alt="Generated Wallpaper" 
          className="max-h-full max-w-full rounded-lg shadow-2xl object-contain ring-1 ring-white/10"
        />
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-8 left-0 right-0 px-6 max-w-md mx-auto flex gap-4">
        <button
          onClick={handleRemix}
          className="flex-1 bg-white/10 backdrop-blur-md text-white py-4 rounded-xl font-medium active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Remix
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-medium active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:bg-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          다운로드
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
