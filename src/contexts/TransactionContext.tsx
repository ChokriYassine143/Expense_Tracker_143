
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionType, Category, DashboardStats } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  stats: DashboardStats;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
}

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Food', type: 'expense', color: '#e74c3c' },
  { id: 'cat-2', name: 'Transportation', type: 'expense', color: '#e67e22' },
  { id: 'cat-3', name: 'Housing', type: 'expense', color: '#f39c12' },
  { id: 'cat-4', name: 'Entertainment', type: 'expense', color: '#9b59b6' },
  { id: 'cat-5', name: 'Utilities', type: 'expense', color: '#3498db' },
  { id: 'cat-6', name: 'Salary', type: 'income', color: '#2ecc71' },
  { id: 'cat-7', name: 'Freelance', type: 'income', color: '#1abc9c' },
  { id: 'cat-8', name: 'Investments', type: 'income', color: '#27ae60' },
  { id: 'cat-9', name: 'Gifts', type: 'income', color: '#8e44ad' },
];

const defaultStats: DashboardStats = {
  totalExpenses: 0,
  totalIncome: 0,
  balance: 0,
  recentTransactions: [],
  expenseCategories: [],
  incomeCategories: [],
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Reset data when user logs out
      setTransactions([]);
      setCategories(defaultCategories);
      setStats(defaultStats);
    }
    setIsLoading(false);
  }, [user]);

  // Calculate stats whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      calculateStats();
    }
  }, [transactions, categories]);

  const loadUserData = () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Load transactions
    const savedTransactions = localStorage.getItem(`transactions-${user.id}`);
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    // Load categories (or use defaults if none exist)
    const savedCategories = localStorage.getItem(`categories-${user.id}`);
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      localStorage.setItem(`categories-${user.id}`, JSON.stringify(defaultCategories));
    }
    
    setIsLoading(false);
  };

  const calculateStats = () => {
    // Calculate total expenses and income
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    
    // Get recent transactions
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    // Calculate category statistics
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Map to array with colors
    const expenseCategories = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      color: categories.find(c => c.name === category)?.color || '#ccc',
    }));
    
    const incomeCategories = Object.entries(incomeByCategory).map(([category, amount]) => ({
      category,
      amount,
      color: categories.find(c => c.name === category)?.color || '#ccc',
    }));
    
    setStats({
      totalExpenses,
      totalIncome,
      balance,
      recentTransactions,
      expenseCategories,
      incomeCategories,
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: `trx-${Date.now()}`,
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    
    // Save to localStorage
    localStorage.setItem(`transactions-${user.id}`, JSON.stringify(updatedTransactions));
    
    toast({
      title: `${transaction.type === 'expense' ? 'Expense' : 'Income'} added`,
      description: `${transaction.description} - $${transaction.amount.toFixed(2)}`,
    });
  };

  const deleteTransaction = (id: string) => {
    if (!user) return;
    
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    
    // Save to localStorage
    localStorage.setItem(`transactions-${user.id}`, JSON.stringify(updatedTransactions));
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed",
    });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    if (!user) return;
    
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    
    // Save to localStorage
    localStorage.setItem(`categories-${user.id}`, JSON.stringify(updatedCategories));
    
    toast({
      title: "Category added",
      description: `${newCategory.name} has been added to your categories`,
    });
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      categories, 
      isLoading, 
      stats,
      addTransaction, 
      deleteTransaction, 
      addCategory 
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
