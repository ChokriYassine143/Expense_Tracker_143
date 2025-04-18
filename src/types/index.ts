export type User = {
  id: string;
  email: string;
  name: string;
}

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  emoji?: string;
}

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export type DashboardStats = {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  recentTransactions: Transaction[];
  expenseCategories: { category: string; amount: number; color: string }[];
  incomeCategories: { category: string; amount: number; color: string }[];
}
