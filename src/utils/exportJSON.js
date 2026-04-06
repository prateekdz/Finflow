export function exportJSON(rows, filename = 'finflow-export') {
  const payload = {
    exported_at: new Date().toISOString(),
    version: '1.0',
    count: rows.length,
    transactions: rows,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
