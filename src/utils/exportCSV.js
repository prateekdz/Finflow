export function exportCSV(rows, filename = 'finflow-export') {
  const BOM = '\uFEFF';
  const headers = ['Date', 'Description', 'Merchant', 'Amount', 'Type', 'Category', 'Status', 'Account', 'Notes'];
  const csvRows = rows.map((tx) =>
    [
      tx.Date ?? tx.date ?? '',
      `"${String(tx.Description ?? tx.description ?? '').replace(/"/g, '""')}"`,
      `"${String(tx.Merchant ?? tx.merchant ?? '').replace(/"/g, '""')}"`,
      tx.Amount ?? tx.amount ?? '',
      tx.Type ?? tx.type ?? '',
      tx.Category ?? tx.category ?? '',
      tx.Status ?? tx.status ?? '',
      tx.Account ?? tx.account ?? '',
      `"${String(tx.Notes ?? tx.notes ?? '').replace(/"/g, '""')}"`,
    ].join(',')
  );

  const csv = BOM + [headers.join(','), ...csvRows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
