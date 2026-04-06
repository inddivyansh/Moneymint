import type { Transaction } from './dashboard-store';

export function exportCSV(transactions: Transaction[], filename = 'moneymint-transactions.csv') {
  const headers = ['Date', 'Title', 'Amount', 'Category', 'Type'];
  const rows = transactions.map((tx) => [
    tx.date,
    `"${tx.title.replace(/"/g, '""')}"`,
    tx.type === 'income' ? tx.amount : -tx.amount,
    tx.category,
    tx.type,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportJSON(transactions: Transaction[], filename = 'moneymint-transactions.json') {
  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
