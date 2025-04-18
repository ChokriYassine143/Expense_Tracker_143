
import { Transaction } from '@/types';

export const exportToExcel = (transactions: Transaction[], type: 'expense' | 'income') => {
  // Create CSV content
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Emoji'];
  const csvContent = [
    headers.join(','),
    ...transactions
      .filter(t => t.type === type)
      .map(t => [
       new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        t.category,
        t.amount.toString(),
        t.emoji || ''
      ].join(','))
  ].join('\n');

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${type}s-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
