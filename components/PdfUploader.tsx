
import React, { useState, useRef } from 'react';
import { parsePdf } from '../services/pdfParser';
import Icon from './common/Icon';
import Spinner from './common/Spinner';

interface PdfUploaderProps {
  addPdfContent: (text: string, filename: string) => void;
  fileStatus: { [key: string]: string };
  updateFileStatus: (filename: string, status: string) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ addPdfContent, fileStatus, updateFileStatus }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    setError(null);
    updateFileStatus(file.name, 'processing');

    try {
      const text = await parsePdf(file);
      addPdfContent(text, file.name);
    } catch (err) {
      console.error('Failed to parse PDF:', err);
      updateFileStatus(file.name, 'error');
      setError('Failed to process PDF file. See console for details.');
    } finally {
        // Reset file input to allow uploading the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="pdf-upload"
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 px-4 rounded-md transition duration-200 cursor-pointer"
        >
          <Icon type="upload" className="w-5 h-5" />
          Upload PDF
        </label>
        <input
          id="pdf-upload"
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {Object.keys(fileStatus).length > 0 && (
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold text-slate-400">Uploads:</h4>
          <ul className="space-y-1">
            {Object.entries(fileStatus).map(([name, status]) => (
              <li key={name} className="flex items-center justify-between text-slate-400">
                <span className="truncate pr-2">{name}</span>
                {status === 'processing' && <Spinner className="w-4 h-4 text-indigo-400" />}
                {status === 'processed' && <span className="text-green-400 font-medium">Done</span>}
                {status === 'error' && <span className="text-red-400 font-medium">Error</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
