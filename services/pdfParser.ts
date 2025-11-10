
declare const pdfjsLib: any;

export const parsePdf = async (file: File): Promise<string> => {
  if (typeof pdfjsLib === 'undefined') {
    console.error('pdf.js is not loaded.');
    throw new Error('PDF library not available.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};
