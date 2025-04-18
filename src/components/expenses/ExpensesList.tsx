
import React from 'react';
import { ArrowDownCircle, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ExpensesListProps {
  expenses: Transaction[];
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ExpensesList = ({ expenses, onDelete, searchTerm, onSearchChange }: ExpensesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
        <CardDescription>View and manage your past expenses</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div 
                key={expense.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  {expense.emoji ? (
                    <span className="text-xl">{expense.emoji}</span>
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-expense" />
                  )}
                  <div>
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-expense">
                    -{formatCurrency(expense.amount)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No expenses found. Add your first expense!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
