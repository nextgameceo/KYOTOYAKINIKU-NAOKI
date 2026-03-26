import { createClient } from 'microcms-js-sdk';

// microCMSクライアントの唯一のインスタンス（全ページで共有）
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

// ─── 型定義 ───────────────────────────────────────────────

export type News = {
  id: string;
  title: string;
  /** リッチエディタの本文（HTMLとして返却される） */
  content: string;
  publishedAt: string;
  updatedAt: string;
  image?: { url: string; width: number; height: number };
  category?: 'news' | 'blog';
};

export type MenuItem = {
  id: string;
  /** microCMSのフィールド名に合わせて "title" を使用 */
  title: string;
  price: number;
  description?: string;
  category?: string;
  image?: { url: string; width: number; height: number };
};

export type Wage = {
  id: string;
  title: string;
  image: { url: string; width: number; height: number };
  description?: string;
  publishedAt: string;
};

export type ShopInfo = {
  id: string;
  name: string;
  address: string;
  tel: string;
  hours: string;
  holiday: string;
  access: string;
};

// ─── データ取得関数 ───────────────────────────────────────

export const getNewsList = async (limit = 5) => {
  return await client.getList<News>({
    endpoint: 'news',
    queries: { limit, orders: '-publishedAt' },
    customRequestInit: { cache: 'no-store' },
  });
};

export const getNewsDetail = async (id: string) => {
  return await client.get<News>({
    endpoint: 'news',
    contentId: id,
    customRequestInit: { cache: 'no-store' },
  });
};

export const getMenuList = async () => {
  return await client.getList<MenuItem>({
    endpoint: 'menu',
    queries: { limit: 100 },
    customRequestInit: { cache: 'no-store' },
  });
};

export const getWageList = async (limit = 6) => {
  return await client.getList<Wage>({
    endpoint: 'wage',
    queries: { limit, orders: '-publishedAt' },
    customRequestInit: { cache: 'no-store' },
  });
};

export const getShopInfo = async () => {
  const res = await client.getList<ShopInfo>({
    endpoint: 'shop-info',
    queries: { limit: 1 },
    customRequestInit: { cache: 'no-store' },
  });
  return res.contents[0] ?? null;
};
