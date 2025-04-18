import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  ArrowUpCircle, 
  CalendarIcon, 
  Search, 
  Trash2 
} from 'lucide-react';
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().min(2, { message: "Description is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.date(),
});

type IncomeFormValues = z.infer<typeof formSchema>;

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

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
    },
  });

  const onSubmit = (values: IncomeFormValues) => {
    const newTransaction: Omit<Transaction, 'id'> = {
      amount: values.amount,
      description: values.description,
      category: values.category,
      date: values.date.toISOString(),
      type: 'income',
    };
    
    addTransaction(newTransaction);
    
    form.reset({
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Income</h1>
        <p className="text-muted-foreground">Manage and track your income</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Add Income Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Income</CardTitle>
            <CardDescription>Record a new income transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Monthly salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {incomeCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-income hover:bg-income/90">
                  Add Income
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Income List */}
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      <ArrowUpCircle className="h-5 w-5 text-income" />
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
                        onClick={() => deleteTransaction(income.id)}
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
      </div>
    </div>
  );
};

export default IncomePage;
