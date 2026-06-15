import { prisma } from "@/lib/prisma";

export async function generateShortCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  while (true) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const exists = await prisma.link.findUnique({
      where: { shortCode: code },
    });

    if (!exists) return code;
  }
}