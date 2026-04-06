const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchTransactions = async (localData) => {
  await delay(600 + Math.random() * 400);
  if (import.meta.env.DEV && Math.random() < 0.05) {
    throw new Error('Network error');
  }
  return [...localData];
};

export const addTransactionApi = async (tx) => {
  await delay(300 + Math.random() * 200);
  return {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
};

export const updateTransactionApi = async (id, updates) => {
  await delay(250);
  return { id, ...updates };
};

export const deleteTransactionApi = async (id) => {
  await delay(200);
  return { id, deleted: true };
};
