
export type User = {
  id: string;
  email: string;
  name: string;
}

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
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
