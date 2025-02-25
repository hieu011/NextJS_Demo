import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
  { id: 3, name: "Tablet", price: 700 },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();
  products.push({ id: products.length + 1, ...body });
  return NextResponse.json({ message: "Product added", products });
}
