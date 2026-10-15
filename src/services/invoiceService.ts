import { jsPDF } from 'jspdf';
import type { OrderItem } from '../types';
import { UPI_PAYEE_CONFIG, formatUtrDisplay } from './upiPayment';

/**
 * HK Code of Rankers — Official Tax Invoice (PDF) Generator
 * ---------------------------------------------------------
 * Produces a print-ready A4 invoice built 100% from the order record that is
 * stored in the database (nothing hard-coded except brand identity).
 *
 * Every block has an explicit millimetre height on A4 portrait (210 x 297 mm),
 * so no section can overlap, clip or float outside its card.
 */

export interface InvoiceResult {
  success: boolean;
  message: string;
  fileName?: string;
}

type RGB = [number, number, number];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 12; // page margin
const CW = PAGE_W - M * 2; // content width = 186mm
const BOTTOM_LIMIT = 248; // new table rows must start above this y

const INK: RGB = [15, 15, 15];
const GOLD: RGB = [200, 164, 93];
const GOLD_L: RGB = [255, 227, 160];
const BROWN: RGB = [138, 101, 30];
const CREAM: RGB = [255, 251, 243];
const CREAM_ALT: RGB = [252, 249, 244];
const CREAM_BORDER: RGB = [232, 214, 180];
const LINE: RGB = [224, 216, 202];
const MUTED: RGB = [110, 110, 110];
const GREEN: RGB = [22, 101, 52];
const GREEN_BG: RGB = [236, 253, 245];
const GREEN_BORDER: RGB = [167, 219, 186];
const AMBER: RGB = [146, 64, 14];
const AMBER_BG: RGB = [255, 247, 237];
const AMBER_BORDER: RGB = [240, 199, 148];
const RED: RGB = [153, 27, 27];
const RED_BG: RGB = [254, 242, 242];
const RED_BORDER: RGB = [254, 202, 202];
const SLATE: RGB = [71, 85, 105];
const NEUTRAL_BG: RGB = [248, 250, 252];
const NEUTRAL_BORDER: RGB = [226, 232, 240];

const HELV = 'helvetica';
const MONO = 'courier';

/** Fixed column anchors for the line item table (single source of truth). */
const COL = {
  index: M + 6,
  desc: M + 13,
  descW: 90,
  qty: M + 122,
  rateRight: M + 152,
  amountRight: PAGE_W - M - 4,
};

/* ------------------------------------------------------------------ */
/* Primitive-safe helpers                                             */
/* ------------------------------------------------------------------ */

function safeText(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function safeNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function money(amount: number): string {
  return 'Rs. ' + Math.round(safeNumber(amount)).toLocaleString('en-IN') + '/-';
}

function formatDate(value: unknown, withTime = false): string {
  try {
    const parsed = new Date(safeText(value, ''));
    if (Number.isNaN(parsed.getTime())) return '—';
    const day = parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    if (!withTime) return day;
    return day + ', ' + parsed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

function amountInWords(amount: number): string {
  const value = Math.round(Math.abs(safeNumber(amount)));
  if (value === 0) return 'Zero Rupees Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const under100 = (n: number): string =>
    n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  const under1000 = (n: number): string => {
    if (n < 100) return under100(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + under100(n % 100) : '');
  };
  let words = '';
  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;
  if (crore) words += under1000(crore) + ' Crore ';
  if (lakh) words += under1000(lakh) + ' Lakh ';
  if (thousand) words += under1000(thousand) + ' Thousand ';
  if (rest) words += under1000(rest);
  return words.trim().replace(/\s+/g, ' ') + ' Rupees Only';
}

interface StatusMeta {
  label: string;
  short: string;
  fg: RGB;
  bg: RGB;
  border: RGB;
}

function statusMeta(status: string): StatusMeta {
  switch (safeText(status).toUpperCase()) {
    case 'COMPLETED':
      return { label: 'PAID & CONFIRMED', short: 'PAID', fg: GREEN, bg: GREEN_BG, border: GREEN_BORDER };
    case 'PENDING_APPROVAL':
      return { label: 'PAYMENT UNDER VERIFICATION', short: 'IN REVIEW', fg: AMBER, bg: AMBER_BG, border: AMBER_BORDER };
    case 'PENDING':
      return { label: 'AWAITING PAYMENT', short: 'PENDING', fg: SLATE, bg: NEUTRAL_BG, border: NEUTRAL_BORDER };
    case 'FAILED':
      return { label: 'PAYMENT FAILED', short: 'FAILED', fg: RED, bg: RED_BG, border: RED_BORDER };
    default:
      return { label: 'RECORDED ON PORTAL', short: 'RECORDED', fg: SLATE, bg: NEUTRAL_BG, border: NEUTRAL_BORDER };
  }
}

/** Truncates a string (in the current font) so it always fits its card. */
function clip(doc: jsPDF, value: unknown, maxWidth: number): string {
  const text = safeText(value);
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && doc.getTextWidth(out + '...') > maxWidth) out = out.slice(0, -1);
  return out + '...';
}

interface InvoiceLine {
  name: string;
  detail: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNo: string;
  orderNumber: string;
  issuedOn: string;
  status: StatusMeta;
  studentName: string;
  email: string;
  phone: string;
  addressLine: string;
  paymentMethod: string;
  utr: string;
  lines: InvoiceLine[];
  gross: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

function buildInvoiceNumber(order: OrderItem): string {
  const orderNumber = safeText(order?.orderNumber, '');
  const core = orderNumber.replace(/^ORD[-_]?/i, '').replace(/[^A-Za-z0-9-]/g, '');
  if (core) return 'INV-' + core;
  const idPart = safeText(order?.id, '').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  const stamp = new Date(safeText(order?.createdAt, '') || Date.now()).getFullYear();
  return 'INV-' + stamp + '-' + (idPart || 'HK0001');
}

function normaliseOrder(order: OrderItem): InvoiceData {
  const billing = (order?.billingDetails || {}) as OrderItem['billingDetails'];
  const rawItems = Array.isArray(order?.items) ? order.items : [];

  const lines: InvoiceLine[] = rawItems.map((item, index) => {
    const source = (item || {}) as { name?: unknown; price?: unknown; quantity?: unknown };
    const qty = Math.max(1, Math.round(safeNumber(source.quantity, 1)));
    const rate = Math.max(0, Math.round(safeNumber(source.price, 0)));
    return {
      name: safeText(source.name, 'CS MENTORSHIP PROGRAM').toUpperCase(),
      detail: '1-on-1 Mentorship • Evaluated Answer Sheets • Student Portal & Study Index Access (Line ' + (index + 1) + ')',
      qty,
      rate,
      amount: rate * qty,
    };
  });

  if (lines.length === 0) {
    const fallbackTotal = Math.max(0, Math.round(safeNumber(order?.totalAmount, 0)));
    lines.push({
      name: 'CS MENTORSHIP PROGRAM',
      detail: '1-on-1 Mentorship • Evaluated Answer Sheets • Student Portal & Study Index Access',
      qty: 1,
      rate: fallbackTotal,
      amount: fallbackTotal,
    });
  }

  const gross = lines.reduce((sum, line) => sum + line.amount, 0);
  const subtotal = Math.round(safeNumber(order?.subtotal, 0)) || gross;
  const discount = Math.max(0, Math.round(safeNumber(order?.discount, 0)));
  const tax = Math.max(0, Math.round(safeNumber(order?.tax, 0)));
  const total = Math.round(safeNumber(order?.totalAmount, 0)) || Math.max(0, subtotal - discount + tax);

  const rawUtr = safeText(order?.utrNumber, '');
  const utr = rawUtr ? formatUtrDisplay(rawUtr) || rawUtr : 'Awaiting UPI reference';

  return {
    invoiceNo: buildInvoiceNumber(order),
    orderNumber: safeText(order?.orderNumber, '—'),
    issuedOn: formatDate(order?.approvedAt || order?.createdAt || new Date().toISOString(), true),
    status: statusMeta(safeText(order?.status, 'PENDING_APPROVAL')),
    studentName: safeText(billing?.fullName, 'Enrolled Student'),
    email: safeText(billing?.email, '—'),
    phone: safeText(billing?.phone, '—'),
    addressLine: [
      safeText(billing?.address),
      safeText(billing?.city),
      safeText(billing?.state),
      safeText(billing?.pincode),
    ]
      .filter(Boolean)
      .join(', '),
    paymentMethod: safeText(order?.paymentMethod, 'UPI'),
    utr,
    lines,
    gross,
    subtotal,
    discount,
    tax,
    total,
  };
}


/* ------------------------------------------------------------------ */
/* Section 1: Document header                                         */
/* ------------------------------------------------------------------ */

function drawHeader(doc: jsPDF, data: InvoiceData, continuation = false): void {
  doc.setFillColor(...INK);
  doc.rect(0, 0, PAGE_W, 40, 'F');
  doc.setFillColor(...GOLD);
  doc.rect(0, 40, PAGE_W, 2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...GOLD_L);
  doc.text('HK CODE OF RANKERS', M, 13);

  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GOLD);
  doc.text('1-ON-1 CS MENTORSHIP & EVALUATED TEST SERIES', M, 18.5);

  doc.setFontSize(7);
  doc.setTextColor(216, 216, 216);
  doc.text('Founder & Head Mentor: Harkiran Kaur (AIR 3, CS Professional)', M, 24);
  doc.text('hkcodeofrankers.com  •  ' + UPI_PAYEE_CONFIG.supportEmail, M, 28.5);
  doc.text('Helpline: ' + UPI_PAYEE_CONFIG.supportPhone + '  •  Payee UPI: ' + UPI_PAYEE_CONFIG.upiId, M, 33);

  doc.setFont(HELV, 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(continuation ? 'TAX INVOICE (CONT.)' : 'TAX INVOICE', PAGE_W - M, 13, { align: 'right' });

  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(...GOLD);
  doc.text('INVOICE NO: ' + data.invoiceNo, PAGE_W - M, 18.5, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(216, 216, 216);
  doc.text('ORDER NO: ' + data.orderNumber, PAGE_W - M, 23.5, { align: 'right' });
  doc.text('ISSUED ON: ' + data.issuedOn, PAGE_W - M, 28, { align: 'right' });

  // Live status pill — mirrors the real database status, never hard-coded
  doc.setFont(HELV, 'bold');
  doc.setFontSize(6.8);
  const pillW = doc.getTextWidth(data.status.label) + 9;
  const pillX = PAGE_W - M - pillW;
  doc.setFillColor(...data.status.bg);
  doc.setDrawColor(...data.status.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(pillX, 30.6, pillW, 6.2, 1.8, 1.8, 'FD');
  doc.setTextColor(...data.status.fg);
  doc.text(data.status.label, pillX + pillW / 2, 34.8, { align: 'center' });
}


/* ------------------------------------------------------------------ */
/* Section 2: Billed-to + invoice reference cards                     */
/* ------------------------------------------------------------------ */

function drawPartyCards(doc: jsPDF, data: InvoiceData): number {
  const top = 48;
  const height = 34;
  const leftW = (CW - 6) * 0.52;
  const rightX = M + leftW + 6;
  const rightW = CW - leftW - 6;

  // Card 1 — student / billed to
  doc.setFillColor(...CREAM);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.35);
  doc.roundedRect(M, top, leftW, height, 2.2, 2.2, 'FD');
  doc.setFillColor(...GOLD);
  doc.roundedRect(M, top, 2.4, height, 1.2, 1.2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  doc.text('BILLED TO / STUDENT DETAILS', M + 6, top + 6.5);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.25);
  doc.line(M + 6, top + 8.6, M + leftW - 4, top + 8.6);

  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(clip(doc, data.studentName, leftW - 12), M + 6, top + 15);

  const studentRows: [string, string][] = [
    ['Email', data.email],
    ['Mobile', data.phone],
    ['Billing Address', data.addressLine || 'Digital delivery — no physical address required'],
  ];
  studentRows.forEach(([label, value], i) => {
    const ry = top + 19.6 + i * 4.9;
    doc.setFont(HELV, 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), M + 6, ry);
    doc.setFont(HELV, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(45, 45, 45);
    doc.text(clip(doc, value, leftW - 42), M + 36, ry);
  });

  // Card 2 — invoice & payment reference
  doc.setFillColor(...CREAM_ALT);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.35);
  doc.roundedRect(rightX, top, rightW, height, 2.2, 2.2, 'FD');
  doc.setFillColor(...GOLD);
  doc.roundedRect(rightX, top, 2.4, height, 1.2, 1.2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  doc.text('INVOICE & PAYMENT REFERENCE', rightX + 6, top + 6.5);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.25);
  doc.line(rightX + 6, top + 8.6, rightX + rightW - 4, top + 8.6);

  const metaRows: [string, string][] = [
    ['Invoice No.', data.invoiceNo],
    ['Order No.', data.orderNumber],
    ['Payment Mode', data.paymentMethod + ' Transfer'],
    ['Status', data.status.label],
  ];
  metaRows.forEach(([label, value], i) => {
    const ry = top + 14.4 + i * 4.9;
    doc.setFont(HELV, 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...MUTED);
    doc.text(label, rightX + 6, ry);
    doc.setFont(HELV, 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(...INK);
    doc.text(clip(doc, value, rightW - 40), rightX + rightW - 5, ry, { align: 'right' });
  });

  const utrY = top + 14.4 + metaRows.length * 4.9;
  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...MUTED);
  doc.text('Transaction UTR', rightX + 6, utrY);
  doc.setFont(MONO, 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(...GREEN);
  doc.text(clip(doc, data.utr, rightW - 40), rightX + rightW - 5, utrY, { align: 'right' });

  return top + height + 8;
}


/* ------------------------------------------------------------------ */
/* Section 3: Line item table (multi-page safe)                       */
/* ------------------------------------------------------------------ */

function drawTableHeader(doc: jsPDF, top: number): number {
  const height = 8.6;
  doc.setFillColor(...INK);
  doc.rect(M, top, CW, height, 'F');
  doc.setFont(HELV, 'bold');
  doc.setFontSize(7.4);
  doc.setTextColor(...GOLD_L);
  doc.text('#', COL.index, top + 5.6, { align: 'center' });
  doc.text('PROGRAM / SERVICE DESCRIPTION', COL.desc, top + 5.6);
  doc.text('QTY', COL.qty, top + 5.6, { align: 'center' });
  doc.text('RATE (INR)', COL.rateRight, top + 5.6, { align: 'right' });
  doc.text('AMOUNT (INR)', COL.amountRight, top + 5.6, { align: 'right' });
  doc.setFillColor(...GOLD);
  doc.rect(M, top + height, CW, 0.6, 'F');
  return top + height + 0.6;
}

function drawItemsTable(doc: jsPDF, data: InvoiceData, startY: number): number {
  let top = drawTableHeader(doc, startY);

  data.lines.forEach((line, index) => {
    doc.setFont(HELV, 'bold');
    doc.setFontSize(8.4);
    const nameLines = (doc.splitTextToSize(line.name, COL.descW) as string[]).slice(0, 2);
    doc.setFont(HELV, 'normal');
    doc.setFontSize(7.2);
    const detailLines = (doc.splitTextToSize(line.detail, COL.descW) as string[]).slice(0, 1);
    const bodyHeight = nameLines.length * 4.4 + detailLines.length * 3.8;
    const rowHeight = Math.max(12.5, 4.2 + bodyHeight + 3.4);

    if (top + rowHeight > BOTTOM_LIMIT) {
      doc.addPage();
      drawHeader(doc, data, true);
      top = drawTableHeader(doc, 48);
    }

    if (index % 2 === 1) {
      doc.setFillColor(...CREAM_ALT);
      doc.rect(M, top, CW, rowHeight, 'F');
    }

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M, top + rowHeight, PAGE_W - M, top + rowHeight);
    doc.line(M + 9.6, top, M + 9.6, top + rowHeight);
    doc.line(COL.rateRight + 6, top, COL.rateRight + 6, top + rowHeight);

    doc.setFont(HELV, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(String(index + 1), COL.index, top + 5.6, { align: 'center' });

    let textY = top + 5.6;
    doc.setFont(HELV, 'bold');
    doc.setFontSize(8.4);
    doc.setTextColor(...INK);
    nameLines.forEach((textLine) => {
      doc.text(textLine, COL.desc, textY);
      textY += 4.4;
    });
    doc.setFont(HELV, 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...MUTED);
    detailLines.forEach((textLine) => {
      doc.text(textLine, COL.desc, textY);
      textY += 3.8;
    });

    const valueY = top + rowHeight / 2 + 1.2;
    doc.setFont(HELV, 'normal');
    doc.setFontSize(8.6);
    doc.setTextColor(...INK);
    doc.text(String(line.qty), COL.qty, valueY, { align: 'center' });
    doc.text(money(line.rate), COL.rateRight, valueY, { align: 'right' });
    doc.setFont(HELV, 'bold');
    doc.setTextColor(...BROWN);
    doc.text(money(line.amount), COL.amountRight, valueY, { align: 'right' });

    top += rowHeight;
  });

  return top + 4.5;
}


/* ------------------------------------------------------------------ */
/* Section 4: Payment verification card + amount summary              */
/* ------------------------------------------------------------------ */

function drawPaymentAndTotals(doc: jsPDF, data: InvoiceData, startY: number): number {
  const gap = 6;
  const leftW = CW * 0.6;
  const rightX = M + leftW + gap;
  const rightW = CW - leftW - gap;

  const paymentRows: [string, string][] = [
    ['Payment Status', data.status.label],
    ['Payment Method', data.paymentMethod + ' — Direct UPI / IMPS'],
    ['Payee Name', UPI_PAYEE_CONFIG.accountName],
    ['Payee UPI ID', UPI_PAYEE_CONFIG.upiId],
    ['Transaction UTR', data.utr],
    ['Recorded On', data.issuedOn],
  ];

  const summaryRows: [string, string][] = [['Program Subtotal', money(data.gross)]];
  if (data.discount > 0) summaryRows.push(['Scholarship / Discount', '- ' + money(data.discount)]);
  if (data.tax > 0) summaryRows.push(['Taxes & Fees', money(data.tax)]);
  if (data.subtotal !== data.gross) summaryRows.push(['Fee Adjustments', money(data.subtotal - data.gross)]);

  const rowStep = 4.9;
  // "Amount in words" lives inside card 1 so the invoice never needs an extra page
  doc.setFont(HELV, 'normal');
  doc.setFontSize(6.9);
  const wordsText = amountInWords(data.total);
  const wordsLines = doc.splitTextToSize(wordsText, leftW - 50) as string[];

  const leftHeight = 12.5 + paymentRows.length * rowStep + 4.4 + wordsLines.length * 3.9 + 3;
  const summaryEndY = 13.5 + summaryRows.length * 5.4;
  const rightHeight = summaryEndY + 18;
  const height = Math.max(leftHeight, rightHeight);
  const top = startY;
  const wordsTopY = top + 12.5 + paymentRows.length * rowStep + 3.4;

  // Card 1 — payment verification (mirrors the UTR approved in the admin panel)
  doc.setFillColor(...CREAM_ALT);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.35);
  doc.roundedRect(M, top, leftW, height, 2.2, 2.2, 'FD');
  doc.setFillColor(...GREEN);
  doc.roundedRect(M, top, 2.4, height, 1.2, 1.2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...GREEN);
  doc.text('PAYMENT VERIFICATION & ONBOARDING RECORD', M + 6, top + 6.5);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.25);
  doc.line(M + 6, top + 8.6, M + leftW - 4, top + 8.6);

  paymentRows.forEach(([label, value], i) => {
    const ry = top + 13.5 + i * rowStep;
    doc.setFont(HELV, 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), M + 6, ry);

    const isStatus = label === 'Payment Status';
    const isUtr = label === 'Transaction UTR';
    doc.setFont(isUtr ? MONO : HELV, 'bold');
    doc.setFontSize(isUtr ? 7.6 : 8);
    doc.setTextColor(...(isStatus ? data.status.fg : isUtr ? GREEN : INK));
    doc.text(clip(doc, value, leftW - 48), M + 48, ry);
  });

  // Amount in words — kept inside card 1 to preserve the one-page layout
  doc.setFont(HELV, 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...MUTED);
  doc.text('AMOUNT IN WORDS', M + 6, wordsTopY);
  doc.setFont(HELV, 'normal');
  doc.setFontSize(6.9);
  doc.setTextColor(50, 50, 50);
  wordsLines.forEach((line, i) => doc.text(line, M + 48, wordsTopY + i * 3.9));

  // Card 2 — amount summary with highlighted grand total
  doc.setFillColor(...CREAM);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.35);
  doc.roundedRect(rightX, top, rightW, height, 2.2, 2.2, 'FD');
  doc.setFillColor(...GOLD);
  doc.roundedRect(rightX, top, 2.4, height, 1.2, 1.2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...BROWN);
  doc.text('AMOUNT SUMMARY', rightX + 6, top + 6.5);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.25);
  doc.line(rightX + 6, top + 8.6, rightX + rightW - 4, top + 8.6);

  summaryRows.forEach(([label, value], i) => {
    const ry = top + 13.5 + i * 5.4;
    doc.setFont(HELV, 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(80, 80, 80);
    doc.text(label, rightX + 6, ry);
    doc.setFont(HELV, 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(value, rightX + rightW - 5, ry, { align: 'right' });
  });

  // Grand total bar pinned to the bottom of the summary card
  const totalBarTop = top + height - 14;
  doc.setFillColor(...GOLD_L);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(rightX + 4, totalBarTop, rightW - 8, 11.5, 1.8, 1.8, 'FD');
  doc.setFont(HELV, 'bold');
  doc.setFontSize(8.4);
  doc.setTextColor(...INK);
  doc.text('TOTAL PAID', rightX + 8, totalBarTop + 7.4);
  doc.setFontSize(10.5);
  doc.text(money(data.total), rightX + rightW - 7, totalBarTop + 7.6, { align: 'right' });

  return top + height + 4.5;
}


/* ------------------------------------------------------------------ */
/* Section 5: Enrollment notice (flows) + declaration band (pinned)    */
/* ------------------------------------------------------------------ */

/** y position where the declaration band is pinned (bottom of every page). */
const TERMS_Y = 254;

function ensureSpace(doc: jsPDF, data: InvoiceData, y: number, needed: number, limit = TERMS_Y - 4): number {
  if (y + needed <= limit) return y;
  doc.addPage();
  drawHeader(doc, data, true);
  return 50;
}

const NOTICE_BULLETS = [
  '24-hour onboarding: our admissions desk calls your registered mobile number to schedule your 1-on-1 strategy session with Harkiran Kaur.',
  'Study material & evaluation: chapter-wise test papers, evaluated answer sheets and private review drive links are unlocked inside your Student Portal.',
  'Keep this Tax Invoice safe — it is your official proof of admission. For any payment or access help write to ' +
    UPI_PAYEE_CONFIG.supportEmail +
    ' or call ' +
    UPI_PAYEE_CONFIG.supportPhone +
    '.',
];

const NOTICE_LINE_H = 3.8;

function enrollmentNoticeLayout(doc: jsPDF): { lines: string[][]; height: number } {
  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.2);
  const lines = NOTICE_BULLETS.map((bullet) => doc.splitTextToSize(bullet, CW - 16) as string[]);
  const bodyLineCount = lines.reduce((sum, rows) => sum + rows.length, 0);
  return { lines, height: 9.6 + bodyLineCount * NOTICE_LINE_H + 2 };
}

function measureEnrollmentNotice(doc: jsPDF): number {
  return enrollmentNoticeLayout(doc).height;
}

function drawEnrollmentNotice(doc: jsPDF, startY: number): number {
  const { lines: wrapped, height } = enrollmentNoticeLayout(doc);

  doc.setFillColor(...CREAM);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.35);
  doc.roundedRect(M, startY, CW, height, 2, 2, 'FD');
  doc.setFillColor(...BROWN);
  doc.roundedRect(M, startY, 2.4, height, 1.2, 1.2, 'F');

  doc.setFont(HELV, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BROWN);
  doc.text('IMPORTANT — ENROLLMENT, ACCESS & SUPPORT INFORMATION', M + 6, startY + 6.2);
  doc.setDrawColor(...CREAM_BORDER);
  doc.setLineWidth(0.25);
  doc.line(M + 6, startY + 8.2, PAGE_W - M - 4, startY + 8.2);

  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(70, 70, 70);
  let lineY = startY + 12.2;
  wrapped.forEach((rows, index) => {
    doc.setFont(HELV, 'bold');
    doc.text(String(index + 1) + '.', M + 7, lineY);
    doc.setFont(HELV, 'normal');
    rows.forEach((textLine) => {
      doc.text(textLine, M + 12, lineY);
      lineY += NOTICE_LINE_H;
    });
  });

  return startY + height + 5;
}

/* ------------------------------------------------------------------ */
/* Section 6: Terms, declaration and authorised signature             */
/* ------------------------------------------------------------------ */

function drawTermsAndSignature(doc: jsPDF, startY: number): void {
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(M, startY, PAGE_W - M, startY);

  doc.setFont(HELV, 'bold');
  doc.setFontSize(7.4);
  doc.setTextColor(...BROWN);
  doc.text('TERMS & DECLARATION', M, startY + 5.6);

  doc.setFont(HELV, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  const terms = [
    '1. Fees once paid are non-refundable after the personalised study schedule has been generated for the batch.',
    '2. This is a computer-generated Tax Invoice and is legally valid without a physical signature or seal.',
    '3. Educational services are delivered by HK Code of Rankers under the mentorship of Harkiran Kaur (AIR 3, CS Professional).',
  ];
  terms.forEach((term, i) => doc.text(term, M, startY + 11 + i * 4.2));

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(PAGE_W - M - 58, startY + 8, PAGE_W - M, startY + 8);

  doc.setFont(HELV, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text('Harkiran Kaur', PAGE_W - M, startY + 14, { align: 'right' });

  doc.setFont(HELV, 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...MUTED);
  doc.text('Founder & Head Mentor — AIR 3, CS Professional', PAGE_W - M, startY + 18.4, { align: 'right' });
  doc.text('HK Code of Rankers', PAGE_W - M, startY + 22.4, { align: 'right' });
}

function stampPageFurniture(doc: jsPDF, data: InvoiceData): void {
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.roundedRect(6, 6, PAGE_W - 12, PAGE_H - 12, 2.5, 2.5, 'S');

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(M, PAGE_H - 16, PAGE_W - M, PAGE_H - 16);

    doc.setFont(HELV, 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(...MUTED);
    doc.text('HK Code of Rankers  •  hkcodeofrankers.com  •  ' + UPI_PAYEE_CONFIG.supportPhone, M, PAGE_H - 11.5);
    doc.text('Computer-generated Tax Invoice — valid without signature.', M, PAGE_H - 8);

    doc.setFont(HELV, 'bold');
    doc.setTextColor(...BROWN);
    doc.text(data.invoiceNo, PAGE_W - M, PAGE_H - 11.5, { align: 'right' });
    doc.setFont(HELV, 'normal');
    doc.setTextColor(...MUTED);
    doc.text('Page ' + page + ' of ' + totalPages, PAGE_W - M, PAGE_H - 8, { align: 'right' });
  }
  doc.setPage(1);
}


/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/** Optional instrumentation hook (used by previews / tests to inspect layout). */
export interface BuildInvoiceOptions {
  onSection?: (label: string, y: number, page: number) => void;
}

/** Builds the fully laid-out invoice document (useful for previews/tests). */
export function buildInvoiceDoc(order: OrderItem, options?: BuildInvoiceOptions): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const data = normaliseOrder(order);
  const trace = (label: string, y: number) => options?.onSection?.(label, y, doc.getNumberOfPages());

  try {
    doc.setProperties({
      title: 'Tax Invoice ' + data.invoiceNo + ' — HK Code of Rankers',
      subject: 'CS Mentorship Enrollment — Official Tax Invoice',
      author: 'HK Code of Rankers',
      keywords: data.invoiceNo + ', ' + data.orderNumber + ', CS mentorship invoice, Harkiran Kaur',
      creator: 'HK Code of Rankers Student Portal',
    });
  } catch {
    // document metadata is optional — never block invoice generation for it
  }

  drawHeader(doc, data, false);
  let y = drawPartyCards(doc, data);
  trace('party-cards', y);
  y = drawItemsTable(doc, data, y);
  trace('items-table', y);
  y = ensureSpace(doc, data, y, 52);
  y = drawPaymentAndTotals(doc, data, y);
  trace('payment+totals', y);

  // Enrollment notice flows, but the declaration band is pinned to the bottom
  const noticeHeight = measureEnrollmentNotice(doc);
  if (y + noticeHeight > TERMS_Y - 4) {
    doc.addPage();
    drawHeader(doc, data, true);
    y = 50;
  }
  y = drawEnrollmentNotice(doc, y);
  trace('enrollment-notice', y);

  drawTermsAndSignature(doc, TERMS_Y);
  trace('terms-band', TERMS_Y);
  stampPageFurniture(doc, data);

  return doc;
}

/**
 * Triggers the PDF download with three layered strategies so a real file is
 * always produced, even inside sandboxed previews / iframes.
 */
function savePdfFile(doc: jsPDF, fileName: string): InvoiceResult {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return { success: false, message: 'Invoice download is only available inside the browser.' };
  }

  try {
    doc.save(fileName);
    return { success: true, message: 'Tax Invoice downloaded: ' + fileName, fileName };
  } catch (primaryError) {
    console.warn('[invoice] Native save failed, using manual blob download:', primaryError);
  }

  try {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 6000);
    return { success: true, message: 'Tax Invoice downloaded: ' + fileName, fileName };
  } catch (blobError) {
    console.warn('[invoice] Blob download failed, opening preview tab:', blobError);
  }

  try {
    const previewUrl = String(doc.output('bloburl'));
    const preview = window.open(previewUrl, '_blank');
    if (preview) {
      return {
        success: true,
        message: 'Invoice opened in a new tab — use its download icon to save a copy.',
        fileName,
      };
    }
    return {
      success: false,
      message: 'Your browser blocked the download. Please allow downloads / pop-ups for this site and retry.',
    };
  } catch (finalError) {
    return {
      success: false,
      message: 'Invoice could not be downloaded: ' + (finalError instanceof Error ? finalError.message : 'unknown error'),
    };
  }
}

/** Generates and immediately downloads the official Tax Invoice PDF. */
export function generateInvoicePDF(order: OrderItem): InvoiceResult {
  try {
    const doc = buildInvoiceDoc(order);
    const ref = safeText(order?.orderNumber, '')
      .replace(/[^A-Za-z0-9-]/g, '')
      .toUpperCase();
    const fileName = 'HK-Rankers-Tax-Invoice-' + (ref || 'HK0001') + '.pdf';
    return savePdfFile(doc, fileName);
  } catch (err) {
    console.error('[invoice] Generation failed:', err);
    return {
      success: false,
      message: 'Could not generate the invoice PDF: ' + (err instanceof Error ? err.message : 'unexpected error'),
    };
  }
}

/** Alias kept for existing callers (OrderContext, Thank You modal). */
export function downloadInvoicePDF(order: OrderItem): InvoiceResult {
  return generateInvoicePDF(order);
}

