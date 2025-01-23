const lnService = require('ln-service');
const config = require('../config/lnd-config');
const logger = require('../config/logger');

const lnd = lnService.authenticatedLndGrpc(config);

const createInvoice = async (amount, memo) => {
  try {
    const invoice = await lnService.createInvoice({
      lnd,
      tokens: amount,
      description: memo,
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
    });
    logger.info('Invoice created', { amount, memo, payment_request: invoice.request });
    return invoice;
  } catch (error) {
    logger.error('Error creating invoice', { error: error.message });
    throw error;
  }
};

const payInvoice = async (paymentRequest) => {
  try {
    const payment = await lnService.pay({
      lnd,
      request: paymentRequest,
    });
    logger.info('Payment sent', { payment });
    return payment;
  } catch (error) {
    logger.error('Error paying invoice', { error: error.message });
    throw error;
  }
};

module.exports = {
  createInvoice,
  payInvoice,
};