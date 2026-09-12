import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete(ADMIN_SESSION_COOKIE);
    response.cookies.delete("admin_authenticated");
    return response;
}
