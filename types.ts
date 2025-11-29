export interface GeneratedImage {
  id: string;
  dataUrl: string; // Base64 Data URL
  prompt: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}
