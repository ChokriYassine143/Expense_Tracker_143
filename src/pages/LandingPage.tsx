
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  BarChart3, 
  ChartPie, 
  DollarSign, 
  Lock, 
  ShieldCheck, 
  Wallet 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-primary py-20 px-6 text-primary-foreground">
        <div className="container mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Track Your <span className="text-accent">Finances</span> with Ease
              </h1>
              <p className="text-lg md:text-xl">
                A simple and powerful expense tracker to help you manage your money, track spending and reach your financial goals.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent backdrop-blur-sm border-white/20">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Card className="bg-card/90 backdrop-blur-sm border-white/10 shadow-xl rotate-3 p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Total Balance</h3>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold">$2,456.00</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-500/10 p-3 rounded-md">
                      <div className="text-sm text-green-500 font-medium">Income</div>
                      <div className="text-lg font-medium">$3,240.00</div>
                    </div>
                    <div className="bg-red-500/10 p-3 rounded-md">
                      <div className="text-sm text-red-500 font-medium">Expenses</div>
                      <div className="text-lg font-medium">$784.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute top-10 right-10 bg-card/90 backdrop-blur-sm border-white/10 shadow-xl -rotate-3 p-4">
                <CardContent className="p-0">
                  <ChartPie className="h-8 w-8 text-primary mb-2" />
                  <div className="text-sm font-medium">Analytics</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-6 bg-muted">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your finances in one intuitive application
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <Wallet className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
                <p className="text-muted-foreground">
                  Record and categorize your expenses to see where your money goes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Income Management</h3>
                <p className="text-muted-foreground">
                  Keep track of all your income sources in one place.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  View detailed charts and graphs to understand your spending patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <ChartPie className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Budgeting Tools</h3>
                <p className="text-muted-foreground">
                  Set budgets for different categories and track your progress.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Lock className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Secure Login</h3>
                <p className="text-muted-foreground">
                  Your financial data is protected with secure authentication.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <ShieldCheck className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
                <p className="text-muted-foreground">
                  Your data stays on your device - we don't store your financial details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 px-6 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of users who are mastering their finances with our expense tracker.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/register" className="flex items-center gap-2">
                Create Your Account <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/50 mt-auto">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
