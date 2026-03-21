import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

export type News = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  category: 'news' | 'blog';
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: { url: string };
};

export type Wage = {
  id: string;
  title: string;
  image: { url: string };
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

export const getNewsList = async (limit = 5) => {
  return await client.getList<News>({
    endpoint: 'news',
    queries: { limit, orders: '-publishedAt' },
  });
};

export const getMenuList = async () => {
  return await client.getList<MenuItem>({
    endpoint: 'menu',
    queries: { limit: 100 },
  });
};

export const getWageList = async (limit = 6) => {
  return await client.getList<Wage>({
    endpoint: 'wage',
    queries: { limit, orders: '-publishedAt' },
  });
};

export const getShopInfo = async () => {
  const res = await client.getList<ShopInfo>({
    endpoint: 'shop-info',
    queries: { limit: 1 },
  });
  return res.contents[0];
};
