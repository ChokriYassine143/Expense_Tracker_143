
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { exportToExcel } from '@/utils/exportUtils';
import IncomeForm from '@/components/income/IncomeForm';
import IncomeList from '@/components/income/IncomeList';

const IncomePage = () => {
  const { transactions, categories, addTransaction, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  
  const incomes = transactions
    .filter(t => t.type === 'income')
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Manage and track your income</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => exportToExcel(transactions, 'income')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <IncomeForm 
          categories={incomeCategories}
          onSubmit={addTransaction}
        />
        <IncomeList 
          incomes={incomes}
          onDelete={deleteTransaction}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default IncomePage;
