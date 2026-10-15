/**
 * HK Code of Rankers — Direct UPI Payment Service
 * Payee Name: Harkiran Kaur
 * UPI ID: harkirankaurr@ibl
 */

export const UPI_PAYEE_CONFIG = {
  accountName: 'Harkiran Kaur',
  upiId: 'harkirankaurr@ibl',
  merchantCode: '8299', // Educational Services
  academyName: 'HK Code of Rankers',
  supportPhone: '+91 92840 84523',
  supportEmail: 'support.hkcodeofrankers@gmail.com',
};

/**
 * Builds standard NPCI UPI URI string for 1-tap mobile app launch and QR generation
 */
export function buildUpiUri(amount: number, note = 'CS Mentorship Enrollment'): string {
  const cleanAmount = Number(amount).toFixed(2);
  const cleanNote = note.replace(/[^a-zA-Z0-9 ]/g, ' ').substring(0, 30).trim();

  const params = new URLSearchParams({
    pa: UPI_PAYEE_CONFIG.upiId,
    pn: UPI_PAYEE_CONFIG.accountName,
    am: cleanAmount,
    cu: 'INR',
    tn: cleanNote || 'HK Rankers Mentorship',
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Generates dynamic, high-resolution QR code URL for laptop / desktop scanning
 */
export function getUpiQrCodeUrl(amount: number, note = 'CS Mentorship Enrollment'): string {
  const upiUri = buildUpiUri(amount, note);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
    upiUri
  )}`;
}

/**
 * Validates whether the given string is a valid 12-digit Indian UPI Reference (UTR) Number
 */
export function validateUtrNumber(utr: string): {
  isValid: boolean;
  cleanedUtr: string;
  errorMessage?: string;
} {
  const cleaned = (utr || '').replace(/\D/g, ''); // strip all non-digits

  if (!cleaned) {
    return {
      isValid: false,
      cleanedUtr: '',
      errorMessage: 'Please enter the 12-digit UPI Reference / UTR number from your payment app.',
    };
  }

  if (cleaned.length < 12) {
    return {
      isValid: false,
      cleanedUtr: cleaned,
      errorMessage: `UTR must be exactly 12 digits (currently ${cleaned.length}/12 digits entered).`,
    };
  }

  if (cleaned.length > 12) {
    return {
      isValid: false,
      cleanedUtr: cleaned.substring(0, 12),
      errorMessage: 'UTR number cannot exceed 12 digits.',
    };
  }

  // A valid UPI UTR is 12 digits (typically starting with 3, 4, 5, or 6 in India)
  return {
    isValid: true,
    cleanedUtr: cleaned,
  };
}

/**
 * Formats a 12-digit UTR into readable blocks: "4248 1029 4821"
 */
export function formatUtrDisplay(utr: string): string {
  const digits = (utr || '').replace(/\D/g, '').substring(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}
