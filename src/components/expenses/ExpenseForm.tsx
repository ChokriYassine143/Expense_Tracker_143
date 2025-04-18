
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Category, Transaction } from '@/types';
import EmojiPicker from '@/components/EmojiPicker';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().min(2, { message: "Description is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  date: z.date(),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

const ExpenseForm = ({ categories, onSubmit }: ExpenseFormProps) => {
  const [selectedEmoji, setSelectedEmoji] = React.useState<string>('');
  
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
    },
  });

  const handleSubmit = (values: ExpenseFormValues) => {
    const newTransaction: Omit<Transaction, '_id'> = {
      amount: values.amount,
      description: values.description,
      category: values.category,
      date: values.date.toISOString(),
      type: 'expense',
      emoji: selectedEmoji,
    };
    
    onSubmit(newTransaction);
    setSelectedEmoji('');
    form.reset({
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>Record a new expense transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount ($)</FormLabel>
                    <div className="flex gap-2">
                      <EmojiPicker 
                        onEmojiSelect={setSelectedEmoji} 
                        selectedEmoji={selectedEmoji}
                      />
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" {...field} />
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
                      {categories.map((category) => (
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
            
            <Button type="submit" className="w-full bg-expense hover:bg-expense/90">
              Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
