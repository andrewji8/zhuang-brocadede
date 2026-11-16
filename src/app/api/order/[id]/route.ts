import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  return NextResponse.json(order);
}
