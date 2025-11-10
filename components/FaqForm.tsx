
import React, { useState } from 'react';
import { FAQ } from '../types';
import Icon from './common/Icon';

interface FaqFormProps {
  addFaq: (faq: FAQ) => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ addFaq }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      addFaq({ question, answer });
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-slate-400 mb-1">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What is the capital of France?"
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          rows={2}
        />
      </div>
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-slate-400 mb-1">
          Answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="e.g., The capital of France is Paris."
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={!question.trim() || !answer.trim()}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        <Icon type="plus" className="w-5 h-5" />
        Add FAQ
      </button>
    </form>
  );
};

export default FaqForm;
