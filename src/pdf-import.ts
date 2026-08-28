export interface ImportedPdfFields {
  reference?: string;
  client?: string;
  amount?: string;
  currency?: string;
}

export async function readInvoicePdf(file: File): Promise<ImportedPdfFields> {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Choose an invoice PDF.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a PDF smaller than 10 MB.');
  const [{ getDocument, GlobalWorkerOptions }, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  GlobalWorkerOptions.workerSrc = worker.default;
  const document = await getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const lines: string[] = [];
  for (let pageNumber = 1; pageNumber <= Math.min(document.numPages, 8); pageNumber += 1) {
    const content = await (await document.getPage(pageNumber)).getTextContent();
    lines.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  const text = lines.join('\n').replace(/\s+/g, ' ').trim();
  const stem = file.name.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').trim();
  const reference = text.match(/(?:invoice|inv(?:oice)?\s*(?:no|number|#)?)[\s:#-]*([A-Z0-9][A-Z0-9-]{2,30})/i)?.[1]
    ?? file.name.replace(/\.pdf$/i, '').slice(0, 80);
  const amountMatch = text.match(/(?:total|amount due|balance due)[\s:]*([$€£₹])?\s*([0-9][0-9,]*(?:\.\d{1,2})?)/i);
  const symbol = amountMatch?.[1];
  const currency = symbol === '€' ? 'EUR' : symbol === '£' ? 'GBP' : symbol === '₹' ? 'INR' : symbol === '$' ? 'USD' : undefined;
  const client = text.match(/(?:bill to|client)[\s:]+([A-Z][A-Za-z0-9&.' -]{2,80}?)(?=\s(?:invoice|date|address|total|amount|$))/i)?.[1]?.trim();
  return {
    reference,
    client: client || (stem !== reference ? stem.slice(0, 120) : undefined),
    amount: amountMatch?.[2]?.replaceAll(',', ''),
    currency,
  };
}
