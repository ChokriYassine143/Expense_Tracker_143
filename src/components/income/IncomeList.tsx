
import React from 'react';
import { ArrowUpCircle, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface IncomeListProps {
  incomes: Transaction[];
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const IncomeList = ({ incomes, onDelete, searchTerm, onSearchChange }: IncomeListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income History</CardTitle>
        <CardDescription>View and manage your past income</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search income..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <div 
                key={income.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  {income.emoji ? (
                    <span className="text-xl">{income.emoji}</span>
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-income" />
                  )}
                  <div>
                    <div className="font-medium">{income.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {income.category} • {new Date(income.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-income">
                    +{formatCurrency(income.amount)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDelete(income.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No income records found. Add your first income!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeList;
