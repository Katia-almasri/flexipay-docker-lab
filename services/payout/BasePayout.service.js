/**
 * @typedef {Object} PayoutDetails
 * @property {string} recipientName
 * @property {string} iban
 * @property {string} swift
 * @property {number} amount
 * @property {string} currency
 * @property {string} reference
 */

/**
 * @interface BasePayoutService
 * @function sendPayout
 * @param {PayoutDetails} details
 * @returns {Promise<{ success: boolean, transactionId?: string, error?: any }>}
 */
