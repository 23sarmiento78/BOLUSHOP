import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";

export async function requireAdmin() {
    const cookieStore = await cookies();
    const valid = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    if (!valid) throw new Error("Unauthorized");
    return true;
}
