import { prisma } from "./prisma";

const RESERVED = ["admin", "api", "dashboard", "create", "analytics"];

export async function generateShortCode(custom?: string) {
  if (custom) {
    if (RESERVED.includes(custom)) {
      throw new Error("Reserved keyword");
    }

    const exists = await prisma.link.findUnique({
      where: { shortCode: custom },
    });

    if (exists) {
      throw new Error("Alias already taken");
    }

    return custom;
  }

  let code = "";
  let exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8);
    const found = await prisma.link.findUnique({
      where: { shortCode: code },
    });
    exists = !!found;
  }

  return code;
}