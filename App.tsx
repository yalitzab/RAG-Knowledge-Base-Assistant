
import React, { useEffect } from 'react';
import KnowledgeManager from './components/KnowledgeManager';
import ChatWindow from './components/ChatWindow';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const App: React.FC = () => {
  const { faqs, pdfText, addFaq, addPdfContent, fileStatus, updateFileStatus } = useKnowledgeBase();

  useEffect(() => {
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          RAG Knowledge Base Assistant
        </h1>
        <p className="text-slate-400 mt-1">
          Chat with an AI powered by a dynamic knowledge base you create.
        </p>
      </header>
      <main className="container mx-auto max-w-7xl h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <div className="md:col-span-1 h-full min-h-[400px]">
            <KnowledgeManager 
              faqs={faqs} 
              addFaq={addFaq} 
              addPdfContent={addPdfContent}
              fileStatus={fileStatus}
              updateFileStatus={updateFileStatus}
            />
          </div>
          <div className="md:col-span-2 h-full min-h-[500px]">
            <ChatWindow faqs={faqs} pdfText={pdfText} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
