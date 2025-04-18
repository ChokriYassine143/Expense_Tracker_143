
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { exportToExcel } from '@/utils/exportUtils';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import ExpensesList from '@/components/expenses/ExpensesList';

const ExpensesPage = () => {
  const { transactions, categories, addTransaction, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Manage and track your expenses</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => exportToExcel(transactions, 'expense')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseForm 
          categories={expenseCategories}
          onSubmit={addTransaction}
        />
        <ExpensesList 
          expenses={expenses}
          onDelete={deleteTransaction}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
