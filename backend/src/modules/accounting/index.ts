/**
 * Accounting Module
 * Handles financial tracking and reporting
 */

import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface AccountingTransaction {
  id: string;
  transactionType: 'income' | 'expense' | 'adjustment';
  referenceId?: string;
  amount: number;
  description: string;
  accountCode: string;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
}

export interface AccountingReport {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  currentBalance: number;
  transactionCount: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export class AccountingService {
  constructor(private pool: Pool) {}

  /**
   * Record a payment transaction
   */
  async recordPayment(
    studentId: string,
    amount: number,
    paymentType: string,
    kotelamReference?: string
  ): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Get current balance
      const balanceResult = await client.query(
        'SELECT COALESCE(SUM(amount), 0) as total_income FROM accounting_transactions WHERE transaction_type = $1',
        ['income']
      );

      const currentBalance = parseFloat(balanceResult.rows[0].total_income);
      const newBalance = currentBalance + amount;

      // Record transaction
      await client.query(
        `INSERT INTO accounting_transactions 
        (transaction_type, reference_id, amount, description, account_code, balance_before, balance_after)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'income',
          studentId,
          amount,
          `Student payment: ${paymentType} (Kotelam: ${kotelamReference || 'N/A'})`,
          '4000', // Income account code
          currentBalance,
          newBalance,
        ]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get accounting report for a period
   */
  async getReport(startDate: Date, endDate: Date): Promise<AccountingReport> {
    const result = await this.pool.query(
      `SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expense,
        COUNT(*) as transaction_count,
        MAX(balance_after) as current_balance
      FROM accounting_transactions
      WHERE created_at BETWEEN $1 AND $2`,
      [startDate, endDate]
    );

    const row = result.rows[0];

    return {
      totalIncome: parseFloat(row.total_income || 0),
      totalExpenses: parseFloat(row.total_expense || 0),
      netIncome: parseFloat(row.total_income || 0) - parseFloat(row.total_expense || 0),
      currentBalance: parseFloat(row.current_balance || 0),
      transactionCount: parseInt(row.transaction_count || 0),
      period: {
        startDate,
        endDate,
      },
    };
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(limit: number = 50, offset: number = 0): Promise<AccountingTransaction[]> {
    const result = await this.pool.query(
      `SELECT * FROM accounting_transactions
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows.map((row) => ({
      id: row.id,
      transactionType: row.transaction_type,
      referenceId: row.reference_id,
      amount: parseFloat(row.amount),
      description: row.description,
      accountCode: row.account_code,
      balanceBefore: parseFloat(row.balance_before),
      balanceAfter: parseFloat(row.balance_after),
      createdAt: new Date(row.created_at),
    }));
  }

  /**
   * Export accounting data (CSV format)
   */
  async exportToCSV(startDate: Date, endDate: Date): Promise<string> {
    const result = await this.pool.query(
      `SELECT * FROM accounting_transactions
      WHERE created_at BETWEEN $1 AND $2
      ORDER BY created_at DESC`,
      [startDate, endDate]
    );

    const headers = 'ID,Type,Amount,Description,Account Code,Balance Before,Balance After,Date\n';
    const rows = result.rows
      .map(
        (row) =>
          `${row.id},"${row.transaction_type}",${row.amount},"${row.description}",${row.account_code},${row.balance_before},${row.balance_after},"${row.created_at}"`
      )
      .join('\n');

    return headers + rows;
  }
}

// Factory function
export function createAccountingService(pool: Pool): AccountingService {
  return new AccountingService(pool);
}
