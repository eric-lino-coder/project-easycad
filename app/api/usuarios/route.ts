export const dynamic = "force-dynamic"; // Adicione isso no topo do arquivo da API

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const filePath = path.join(
  process.cwd(),
  "app",
  "api",
  "usuarios",
  "dados.json",
);

async function readDatabase() {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { usuarios: [] };
  }
}

async function writeDatabase(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const data = await readDatabase();
  return NextResponse.json(data.usuarios);
}

export async function POST(request: Request) {
  const body = await request.json();
  const data = await readDatabase();

  const novoUsuario = { ...body, id: randomUUID() };
  data.usuarios.push(novoUsuario);

  await writeDatabase(data);
  return NextResponse.json(novoUsuario, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const data = await readDatabase();

  data.usuarios = data.usuarios.map((u: any) =>
    u.id === body.id ? { ...u, ...body } : u,
  );

  await writeDatabase(data);
  return NextResponse.json(body);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const data = await readDatabase();

  data.usuarios = data.usuarios.filter((u: any) => u.id !== id);

  await writeDatabase(data);
  return NextResponse.json({ message: "Removido" });
}
