export { verifyToken } from "@/lib/jwt"

export async function auth(
    req: Request,
): Promise<{ id: string; email: string; role: "USER" | "ADMIN"; iat?: number; exp?: number } | null> {
    return null
}

