import { openDB } from 'idb';

// ================== DB ==================
export async function getDB() {
  return await openDB('factorDB', 2, {  // نسخه 2 چون یک Store جدید اضافه می‌کنیم
    upgrade(db, oldVersion) {
      // Store فاکتورها
      if (!db.objectStoreNames.contains('factors')) {
        db.createObjectStore('factors', { keyPath: 'id', autoIncrement: true });
      }
      // Store مجری‌ها
      if (!db.objectStoreNames.contains('runners')) {
        db.createObjectStore('runners', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

// ================== Factors ==================
export async function saveFactor(factor: { 
  id?: number, 
  name: string, 
  sum: number, 
  date: string, 
  items: any[] 
}) {
  const db = await getDB();
  if (factor.id !== undefined) {
    const existing = await db.get('factors', factor.id);
    if (existing) {
      await db.put('factors', factor);
      return factor.id;
    }
  }
  return await db.add('factors', factor);
}

export async function getAllFactors() {
  const db = await getDB();
  return await db.getAll('factors');
}

export async function deleteFactor(id: number) {
  const db = await getDB();
  await db.delete('factors', id);
}

// ================== Runners (مجری) ==================
export async function saveRunner(runner: {
  id?: number,
  name: string
}) {
  const db = await getDB();
  if (runner.id !== undefined) {
    const existing = await db.get('runners', runner.id);
    if (existing) {
      await db.put('runners', runner);
      return runner.id;
    }
  }
  return await db.add('runners', runner);
}

export async function getAllRunners() {
  const db = await getDB();
  return await db.getAll('runners');
}

export async function deleteRunner(id: number) {
  const db = await getDB();
  await db.delete('runners', id);
}



