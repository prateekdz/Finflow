import { formatCurrency } from './formatCurrency';

export function exportPDF(transactions, filename = 'finflow-transactions.pdf') {
  const popup = window.open('', '_blank', 'width=960,height=720');
  if (!popup) return false;

  const rows = transactions
    .map(
      (tx) => `
        <tr>
          <td>${tx.date}</td>
          <td>${tx.description}</td>
          <td>${tx.merchant}</td>
          <td>${tx.category}</td>
          <td>${tx.status}</td>
          <td style="text-align:right;">${formatCurrency(Math.abs(tx.amount))}</td>
        </tr>
      `
    )
    .join('');

  popup.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin: 0 0 8px; }
          p { color: #64748b; margin: 0 0 24px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; font-size: 12px; }
          th { background: #f8fafc; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Finflow Export</h1>
        <p>${transactions.length} filtered transactions</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
  return true;
}
