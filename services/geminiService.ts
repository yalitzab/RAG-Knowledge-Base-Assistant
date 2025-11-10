
import { GoogleGenAI } from "@google/genai";
import { FAQ } from "../types";

const performSimpleSearch = (query: string, context: string): string => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  const sentences = context.split(/(?<=[.?!])\s+/);
  
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return queryTerms.some(term => lowerSentence.includes(term));
  });

  // Limit context size to avoid overly long prompts
  return relevantSentences.slice(0, 15).join(' ');
};

export const generateAnswer = async (question: string, faqs: FAQ[], pdfText: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const knowledgeBaseText = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n') + '\n' + pdfText;
    
    const relevantContext = performSimpleSearch(question, knowledgeBaseText);

    if (!relevantContext.trim()) {
        return "I couldn't find any relevant information in the knowledge base to answer your question. Please add more FAQs or upload a relevant document.";
    }

    const prompt = `
      You are a helpful assistant. Answer the user's question based *only* on the provided context.
      If the context does not contain the answer, state that you don't have enough information from the provided documents.
      Do not use any external knowledge.

      CONTEXT:
      ---
      ${relevantContext}
      ---

      QUESTION: ${question}

      ANSWER:
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating answer:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        return "There was an error with the API configuration. Please ensure your API key is set up correctly.";
    }
    return "Sorry, I encountered an error while trying to generate an answer. Please check the console for details.";
  }
};
