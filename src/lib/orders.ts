import { promises as fs } from "fs";
import path from "path";
import type { Order, PayStatus } from "./pay/types";

/**
 * 订单本地存储（M4 本地测试用）：
 * 订单写在项目根目录 .data/orders.json。生产环境建议切到 Supabase orders 表
 * （schema.sql 已含该表 + RLS），届时把本文件的读写换成 getSupabaseServer() 查询即可，
 * API 层签名不变。
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "[]\n", "utf8");
  }
}

async function readAll(): Promise<Order[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    const arr = JSON.parse(raw || "[]") as Order[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

export function newOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `YNS-${ts}-${rand}`;
}

export async function createOrder(order: Omit<Order, "id" | "status" | "createdAt" | "channel">): Promise<Order> {
  const full: Order = {
    ...order,
    id: newOrderId(),
    status: "pending",
    channel: null,
    createdAt: new Date().toISOString(),
  };
  const orders = await readAll();
  orders.push(full);
  await writeAll(orders);
  return full;
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await readAll();
  return orders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: PayStatus, channel?: string, extra?: Partial<Order>): Promise<Order | null> {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  orders[idx] = {
    ...orders[idx],
    status,
    channel: (extra?.channel ?? (channel as Order["channel"]) ?? orders[idx].channel),
    ...(status === "paid" ? { paidAt: new Date().toISOString() } : {}),
    ...extra,
  };
  await writeAll(orders);
  return orders[idx];
}
