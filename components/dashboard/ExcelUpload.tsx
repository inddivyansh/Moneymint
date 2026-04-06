'use client';

import { useState, useRef } from 'react';
import { useDashboard, type Transaction, type TransactionType } from '@/lib/dashboard-store';
import * as XLSX from 'xlsx';

export default function ExcelUpload() {
  const { dispatch } = useDashboard();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setPreview([]);
    setImported(false);

    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          const rows = parseCSV(text);
          setPreview(rows);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse CSV');
        }
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
          const rows = parseRows(json);
          setPreview(rows);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported format. Use .csv, .xlsx, or .xls files.');
    }
  }

  function parseCSV(text: string): Transaction[] {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) throw new Error('File is empty or has no data rows.');

    const header = lines[0].toLowerCase().split(',').map(h => h.replace(/"/g, '').trim());
    const dateIdx = header.findIndex(h => h === 'date');
    const titleIdx = header.findIndex(h => h === 'title' || h === 'description' || h === 'name');
    const amountIdx = header.findIndex(h => h === 'amount');
    const categoryIdx = header.findIndex(h => h === 'category');
    const typeIdx = header.findIndex(h => h === 'type');

    if (dateIdx === -1 || amountIdx === -1) {
      throw new Error('CSV must have at least "Date" and "Amount" columns.');
    }

    return lines.slice(1).map((line, i) => {
      const cols = line.split(',').map(c => c.replace(/"/g, '').trim());
      const amount = Math.abs(parseFloat(cols[amountIdx]) || 0);
      const rawType = typeIdx >= 0 ? cols[typeIdx]?.toLowerCase() : '';
      const type: TransactionType = rawType === 'income' ? 'income' : 'expense';

      return {
        id: `imp-${Date.now()}-${i}`,
        date: cols[dateIdx] || new Date().toISOString().slice(0, 10),
        title: titleIdx >= 0 ? cols[titleIdx] || 'Imported' : 'Imported',
        amount,
        category: categoryIdx >= 0 ? cols[categoryIdx] || 'Other' : 'Other',
        type,
      };
    }).filter(t => t.amount > 0);
  }

  function parseRows(rows: Record<string, unknown>[]): Transaction[] {
    return rows.map((row, i) => {
      const date = String(row['Date'] ?? row['date'] ?? new Date().toISOString().slice(0, 10));
      const title = String(row['Title'] ?? row['title'] ?? row['Description'] ?? row['description'] ?? row['Name'] ?? row['name'] ?? 'Imported');
      const amount = Math.abs(parseFloat(String(row['Amount'] ?? row['amount'] ?? 0)));
      const category = String(row['Category'] ?? row['category'] ?? 'Other');
      const rawType = String(row['Type'] ?? row['type'] ?? 'expense').toLowerCase();
      const type: TransactionType = rawType === 'income' ? 'income' : 'expense';

      return { id: `imp-${Date.now()}-${i}`, date, title, amount, category, type };
    }).filter(t => t.amount > 0);
  }

  function confirmImport() {
    if (preview.length === 0) return;
    dispatch({ type: 'ADD_TRANSACTIONS_BULK', payload: preview });
    setImported(true);
    setPreview([]);
    if (fileRef.current) fileRef.current.value = '';
  }

  function cancelImport() {
    setPreview([]);
    setError(null);
    setImported(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="nb-card p-5">
      <h3 className="text-base font-bold mb-1">Import from File</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        Upload a CSV or Excel file with columns: Date, Title, Amount, Category, Type
      </p>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFile}
        className="nb-input text-sm"
        style={{ padding: '8px 12px' }}
      />

      {error && (
        <p className="text-sm font-bold mt-3" style={{ color: 'var(--expense)' }}>{error}</p>
      )}

      {imported && (
        <p className="text-sm font-bold mt-3" style={{ color: 'var(--income)' }}>Transactions imported successfully!</p>
      )}

      {preview.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold mb-2">{preview.length} transactions found:</p>
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="nb-table text-xs">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 10).map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.title}</td>
                    <td style={{ color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                    </td>
                    <td>{tx.category}</td>
                    <td><span className={`nb-badge ${tx.type === 'income' ? 'nb-badge-income' : 'nb-badge-expense'}`}>{tx.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 10 && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>...and {preview.length - 10} more rows</p>
            )}
          </div>
          <div className="flex gap-3 mt-3">
            <button type="button" onClick={confirmImport} className="nb-btn nb-btn-primary nb-btn-sm">
              Import {preview.length} Transactions
            </button>
            <button type="button" onClick={cancelImport} className="nb-btn nb-btn-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
