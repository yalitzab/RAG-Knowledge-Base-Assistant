
import { useState, useCallback } from 'react';
import { FAQ } from '../types';
import { INITIAL_FAQS } from '../constants';

export const useKnowledgeBase = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [pdfText, setPdfText] = useState<string>('');
  const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});

  const addFaq = useCallback((faq: FAQ) => {
    setFaqs(prev => [...prev, faq]);
  }, []);

  const addPdfContent = useCallback((text: string, filename: string) => {
    setPdfText(prev => prev + `\n\n--- Content from ${filename} ---\n\n` + text);
    setFileStatus(prev => ({ ...prev, [filename]: 'processed' }));
  }, []);

  const updateFileStatus = useCallback((filename: string, status: string) => {
    setFileStatus(prev => ({ ...prev, [filename]: status }));
  }, []);

  return { faqs, pdfText, addFaq, addPdfContent, fileStatus, updateFileStatus };
};
