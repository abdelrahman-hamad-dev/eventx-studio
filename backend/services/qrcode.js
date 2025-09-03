import QRCode from 'qrcode';

export const generateQrCodeDataUrl = async (payload) => {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'M', width: 256 });
};
