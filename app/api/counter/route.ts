import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const state = await prisma.data.findFirst({
    where: {
      id: "theone",
    },
  });
  return new Response(JSON.stringify({ count: state?.counter }), {
    headers: { "Content-Type": "application/json" },
  });
}
