
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Function to group transactions by month
const groupByMonth = (transactions: Transaction[]) => {
  const grouped = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        expenses: 0,
        income: 0,
      };
    }
    
    if (transaction.type === 'expense') {
      acc[monthYear].expenses += transaction.amount;
    } else {
      acc[monthYear].income += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { name: string; expenses: number; income: number }>);
  
  return Object.values(grouped).sort((a, b) => {
    const [aMonth, aYear] = a.name.split('/').map(Number);
    const [bMonth, bYear] = b.name.split('/').map(Number);
    return aYear === bYear ? aMonth - bMonth : aYear - bYear;
  });
};

// Function to group transactions by category
const groupByCategory = (transactions: Transaction[], type: 'expense' | 'income') => {
  const filtered = transactions.filter(t => t.type === type);
  
  const grouped = filtered.reduce((acc, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = {
        name: transaction.category,
        value: 0,
      };
    }
    
    acc[transaction.category].value += transaction.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  return Object.values(grouped).sort((a, b) => b.value - a.value);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Analytics = () => {
  const { transactions, categories } = useTransactions();
  const [timeframe, setTimeframe] = useState('all');
  
  // Filter transactions based on selected timeframe
  const filteredTransactions = (() => {
    if (timeframe === 'all') return transactions;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeframe === '30days') {
      cutoffDate.setDate(now.getDate() - 30);
    } else if (timeframe === '6months') {
      cutoffDate.setMonth(now.getMonth() - 6);
    } else if (timeframe === '1year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  })();
  
  const monthlyData = groupByMonth(filteredTransactions);
  const expensesByCategory = groupByCategory(filteredTransactions, 'expense');
  const incomeByCategory = groupByCategory(filteredTransactions, 'income');
  
  const categoryColors = categories.reduce((acc, category) => {
    acc[category.name] = category.color;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Visualize your financial data</p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#2ecc71" />
                    <Bar dataKey="expenses" name="Expenses" fill="#e74c3c" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No data available for the selected timeframe
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Net Savings</CardTitle>
                <CardDescription>Income minus expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData.map(month => ({
                        name: month.name,
                        net: month.income - month.expenses
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, "Net"]} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="net" 
                        name="Net Savings" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available for the selected timeframe
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Income vs Expenses</CardTitle>
                <CardDescription>Aggregated comparison</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { 
                            name: 'Total Income', 
                            value: monthlyData.reduce((sum, month) => sum + month.income, 0) 
                          },
                          { 
                            name: 'Total Expenses', 
                            value: monthlyData.reduce((sum, month) => sum + month.expenses, 0) 
                          }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                      >
                        <Cell fill="#2ecc71" />
                        <Cell fill="#e74c3c" />
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available for the selected timeframe
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
              <CardDescription>Distribution of your spending</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expense data available for the selected timeframe
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expense Ranking</CardTitle>
              <CardDescription>Categories ordered by spending</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={expensesByCategory}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar 
                      dataKey="value" 
                      fill="#e74c3c" 
                      name="Amount" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expense data available for the selected timeframe
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Income Tab */}
        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Breakdown by Category</CardTitle>
              <CardDescription>Distribution of your income sources</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {incomeByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {incomeByCategory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No income data available for the selected timeframe
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Income Ranking</CardTitle>
              <CardDescription>Sources ordered by amount</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {incomeByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeByCategory}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar 
                      dataKey="value" 
                      fill="#2ecc71" 
                      name="Amount" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No income data available for the selected timeframe
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
