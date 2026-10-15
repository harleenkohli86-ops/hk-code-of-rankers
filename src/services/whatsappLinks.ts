/** WhatsApp helper links (no data is stored or sent anywhere — they just open wa.me). */

export const ACADEMY_WHATSAPP = '919284084523';

export interface OrderWhatsAppData {
  studentName: string;
  studentPhone: string;
  programName: string;
  amount: number;
  utrNumber: string;
  orderNumber: string;
}

/** Student -> academy desk: "I have paid, here is my UTR". */
export function getWhatsAppPaymentProofUrl(data: OrderWhatsAppData): string {
  const text =
    `Hello Harkiran Ma'am! I have submitted my UPI payment on HK Code of Rankers.\n\n` +
    `👤 Name: ${data.studentName}\n` +
    `📱 Mobile: ${data.studentPhone}\n` +
    `🧾 Order: ${data.orderNumber}\n` +
    `📚 Program: ${data.programName}\n` +
    `💰 Amount: ₹${data.amount.toLocaleString('en-IN')}\n` +
    `🔢 UTR: ${data.utrNumber}\n\n` +
    `Kindly verify and activate my access. Thank you!`;
  return `https://wa.me/${ACADEMY_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
