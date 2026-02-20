import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'coingecko_history_cache.json');

let cache: Record<string, number> | null = null;

async function loadCache() {
  if (cache) return;
  try {
    const content = await fs.readFile(CACHE_FILE, 'utf8');
    cache = JSON.parse(content || '{}');
  } catch (err) {
    cache = {};
  }
}

async function saveCache() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache || {}, null, 2), 'utf8');
  } catch (err) {
    // best-effort: log silently
    // console.warn('Failed to write price cache', err);
  }
}

export async function getCachedPrice(coinId: string, dateStr: string): Promise<number | undefined> {
  await loadCache();
  const key = `${coinId}-${dateStr}`;
  return cache?.[key];
}

export async function setCachedPrice(coinId: string, dateStr: string, price: number): Promise<void> {
  await loadCache();
  const key = `${coinId}-${dateStr}`;
  cache = cache || {};
  cache[key] = price;
  await saveCache();
}

export async function clearPriceCache(): Promise<void> {
  cache = {};
  await saveCache();
}

export default { getCachedPrice, setCachedPrice, clearPriceCache };
