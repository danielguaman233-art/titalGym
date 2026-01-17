
import { GoogleGenAI } from "@google/genai";
import { Suggestion } from "../types";

export const analyzeSuggestions = async (suggestions: Suggestion[]) => {
  // Always use process.env.API_KEY directly and initialize inside the function
  if (!process.env.API_KEY) {
    return "Configura tu API_KEY para recibir análisis de IA.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analiza las siguientes sugerencias de clientes de un gimnasio y proporciona un resumen ejecutivo con 3 puntos clave para mejorar el negocio: ${suggestions.map(s => s.text).join(' | ')}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un experto consultor de negocios para gimnasios de alto rendimiento. Hablas español profesional."
      }
    });
    // Use the .text property directly instead of calling it as a function
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la inteligencia artificial.";
  }
};
