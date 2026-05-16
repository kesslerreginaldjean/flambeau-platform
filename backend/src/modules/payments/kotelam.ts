/**
 * Kotelam Payment Integration Module
 * Handles integration with Kotelam (Haitian payment system)
 */

import axios, { AxiosInstance } from 'axios';

export interface KotelamPaymentConfig {
  apiKey: string;
  apiUrl: string;
  merchantId: string;
}

export interface KotelamPaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  studentId: string;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface KotelamPaymentResponse {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  reference: string;
  timestamp: Date;
  kotelamReference?: string;
}

export class KotelamPaymentService {
  private client: AxiosInstance;
  private config: KotelamPaymentConfig;

  constructor(config: KotelamPaymentConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initiate a payment request
   */
  async initiatePayment(payment: KotelamPaymentRequest): Promise<KotelamPaymentResponse> {
    try {
      const response = await this.client.post('/payments/initiate', {
        merchant_id: this.config.merchantId,
        amount: payment.amount,
        currency: payment.currency,
        reference: payment.reference,
        description: payment.description,
        customer_email: payment.customerEmail,
        customer_phone: payment.customerPhone,
      });

      return {
        transactionId: response.data.transaction_id,
        status: response.data.status,
        amount: payment.amount,
        reference: payment.reference,
        timestamp: new Date(),
        kotelamReference: response.data.kotelam_reference,
      };
    } catch (error) {
      console.error('Kotelam payment initiation error:', error);
      throw new Error('Failed to initiate payment with Kotelam');
    }
  }

  /**
   * Verify a payment status
   */
  async verifyPayment(transactionId: string): Promise<KotelamPaymentResponse> {
    try {
      const response = await this.client.get(`/payments/${transactionId}/status`);

      return {
        transactionId,
        status: response.data.status,
        amount: response.data.amount,
        reference: response.data.reference,
        timestamp: new Date(response.data.timestamp),
        kotelamReference: response.data.kotelam_reference,
      };
    } catch (error) {
      console.error('Kotelam payment verification error:', error);
      throw new Error('Failed to verify payment with Kotelam');
    }
  }

  /**
   * Get transaction history for a student
   */
  async getTransactionHistory(studentId: string): Promise<KotelamPaymentResponse[]> {
    try {
      const response = await this.client.get(`/merchants/${this.config.merchantId}/transactions`, {
        params: { student_id: studentId },
      });

      return response.data.transactions.map((t: any) => ({
        transactionId: t.transaction_id,
        status: t.status,
        amount: t.amount,
        reference: t.reference,
        timestamp: new Date(t.timestamp),
        kotelamReference: t.kotelam_reference,
      }));
    } catch (error) {
      console.error('Kotelam transaction history error:', error);
      throw new Error('Failed to retrieve transaction history');
    }
  }

  /**
   * Generate payment link for student
   */
  async generatePaymentLink(payment: KotelamPaymentRequest): Promise<string> {
    try {
      const response = await this.client.post('/payments/generate-link', {
        merchant_id: this.config.merchantId,
        amount: payment.amount,
        currency: payment.currency,
        reference: payment.reference,
        description: payment.description,
      });

      return response.data.payment_link;
    } catch (error) {
      console.error('Kotelam payment link generation error:', error);
      throw new Error('Failed to generate payment link');
    }
  }
}

// Factory function
export function createKotelamService(config: KotelamPaymentConfig): KotelamPaymentService {
  return new KotelamPaymentService(config);
}
