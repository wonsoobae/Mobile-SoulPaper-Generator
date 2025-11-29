import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage } from './types';
import ImageViewer from './components/ImageViewer';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImages([]); // Clear previous images to focus on new generation

    try {
      const generatedImages = await generateWallpapers(prompt);
      setImages(generatedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = useCallback((prevPrompt: string) => {
    setPrompt(prevPrompt + " "); // Append space for user to add more details easily
    const inputEl = document.getElementById('prompt-input') as HTMLTextAreaElement;
    if (inputEl) {
      inputEl.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-purple-500 selection:text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-safe">
        <Header />

        {/* Input Area */}
        <div className="px-4 sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-md pb-4 pt-2">
          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 비 오는 서정적인 도시 풍경, 몽환적인 숲..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-base focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-24 text-slate-100 placeholder-slate-500 transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all ${
                isLoading || !prompt.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5"><LoadingSpinner /></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-3 text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="flex-1 px-4 py-4">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 pb-24">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className="relative aspect-[9/16] overflow-hidden rounded-2xl group focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <img
                    src={img.dataUrl}
                    alt={img.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>상상하는 풍경을 텍스트로 그려보세요</p>
              </div>
            )
          )}
          
          {isLoading && images.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 animate-pulse">
              <p className="text-purple-300 mt-4 text-sm font-medium">나만의 배경화면 생성 중...</p>
              <p className="text-slate-500 text-xs mt-1">약 5~10초 정도 소요됩니다</p>
            </div>
          )}
        </div>

        {/* Image Viewer Modal */}
        {selectedImage && (
          <ImageViewer
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onRemix={handleRemix}
          />
        )}
      </div>
    </div>
  );
};

export default App;
