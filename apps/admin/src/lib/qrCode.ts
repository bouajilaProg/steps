import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

const PAGE_MARGIN_MM = 15;
const QR_SIZE_MM = 80;
const TITLE_MAX_LENGTH = 60;

function sanitizeTitle(input: string): string {
  const trimmed = (input ?? '').trim();
  if (!trimmed) return 'Untitled workflow';
  return trimmed.length > TITLE_MAX_LENGTH ? trimmed.slice(0, TITLE_MAX_LENGTH) + '…' : trimmed;
}

function safeFileBase(input: string): string {
  return (
    (input ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'workflow'
  );
}

export async function generateWorkflowQrDataUrl(workflowId: string): Promise<string> {
  return QRCode.toDataURL(workflowId, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 512,
    color: { dark: '#111111', light: '#ffffff' },
  });
}

export async function downloadWorkflowQrPdf(workflowId: string, name: string): Promise<void> {
  const dataUrl = await generateWorkflowQrDataUrl(workflowId);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = sanitizeTitle(name);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(17, 17, 17);
  const titleLines = doc.splitTextToSize(title, pageWidth - PAGE_MARGIN_MM * 2);
  const titleY = PAGE_MARGIN_MM + 8;
  doc.text(titleLines, pageWidth / 2, titleY, { align: 'center' });

  const qrX = (pageWidth - QR_SIZE_MM) / 2;
  const qrY = titleY + (titleLines.length * 8) + 14;
  doc.addImage(dataUrl, 'PNG', qrX, qrY, QR_SIZE_MM, QR_SIZE_MM, undefined, 'FAST');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Scan to open in Steps', pageWidth / 2, qrY + QR_SIZE_MM + 10, {
    align: 'center',
  });

  doc.save(`${safeFileBase(name)}-qr.pdf`);
}
