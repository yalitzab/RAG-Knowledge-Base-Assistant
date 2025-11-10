
import React from 'react';
import { FAQ } from '../types';
import FaqForm from './FaqForm';
import PdfUploader from './PdfUploader';

interface KnowledgeManagerProps {
  faqs: FAQ[];
  addFaq: (faq: FAQ) => void;
  addPdfContent: (text: string, filename: string) => void;
  fileStatus: { [key: string]: string };
  updateFileStatus: (filename: string, status: string) => void;
}

const KnowledgeManager: React.FC<KnowledgeManagerProps> = ({ faqs, addFaq, addPdfContent, fileStatus, updateFileStatus }) => {
  return (
    <div className="bg-slate-800/50 p-4 md:p-6 rounded-lg h-full flex flex-col gap-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-white">Knowledge Base</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2">Add New FAQ</h3>
        <FaqForm addFaq={addFaq} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2">Upload Document</h3>
        <PdfUploader addPdfContent={addPdfContent} fileStatus={fileStatus} updateFileStatus={updateFileStatus} />
      </div>
      
      <div className="flex-grow min-h-0 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-300 border-b border-slate-700 pb-2 mb-4">Current FAQs ({faqs.length})</h3>
        <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-slate-700/50 rounded-md p-3 text-sm">
              <summary className="font-semibold text-slate-200 cursor-pointer">{faq.question}</summary>
              <p className="mt-2 text-slate-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeManager;
