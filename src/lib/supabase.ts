import { createClient } from "@supabase/supabase-js";

/**
 * 浏览器端 Supabase 客户端（anon key，走 RLS）。
 * 未配置 .env 时返回 null，页面需优雅降级（使用本地 seed 数据）。
 */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * 服务端 Supabase 客户端（用于 API routes，可走 service_role 提升权限）。
 */
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
