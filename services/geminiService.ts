import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

// Using gemini-3-pro-image-preview for high quality wallpapers
const MODEL_NAME = 'gemini-3-pro-image-preview';

/**
 * Generates a single image based on the prompt.
 */
async function generateSingleImage(prompt: string, seedOffset: number): Promise<string> {
  // Initialize AI client inside the function to ensure it uses the currently selected API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
          imageSize: "1K" // Or 2K/4K if needed, but 1K is faster for 4-batch
        },
        // Adding a slight variation to the system instruction or seed if supported 
        // to ensure 4 distinct images, though the model is naturally non-deterministic.
        temperature: 1.0, 
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
}

/**
 * Generates 4 parallel variations of a wallpaper.
 */
export const generateWallpapers = async (userPrompt: string): Promise<GeneratedImage[]> => {
  // Enhance prompt for wallpaper quality
  const enhancedPrompt = `High quality, aesthetic mobile wallpaper, 9:16 vertical aspect ratio. ${userPrompt}`;

  // Create 4 promises for parallel generation
  const promises = Array.from({ length: 4 }).map((_, i) => 
    generateSingleImage(enhancedPrompt, i)
      .then(dataUrl => ({
        id: crypto.randomUUID(),
        dataUrl,
        prompt: userPrompt
      }))
  );

  // Use allSettled to return as many successful images as possible
  const results = await Promise.allSettled(promises);
  
  const successfulImages: GeneratedImage[] = [];
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      successfulImages.push(result.value);
    } else {
      console.error("One generation failed:", result.reason);
    }
  });

  if (successfulImages.length === 0) {
    throw new Error("이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }

  return successfulImages;
};