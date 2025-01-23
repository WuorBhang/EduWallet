const QRCode = require('qrcode');
const logger = require('../config/logger');

const generateQRCode = async (data) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    
    logger.info('QR code generated successfully');
    return qrCodeDataUrl;
  } catch (error) {
    logger.error('Error generating QR code', { error: error.message });
    throw new Error('Failed to generate QR code');
  }
};

module.exports = {
  generateQRCode
};