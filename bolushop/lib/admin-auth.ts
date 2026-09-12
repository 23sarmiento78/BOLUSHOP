const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24;

type SessionPayload = {
    email: string;
    exp: number;
};

function getSessionSecret() {
    // ADMIN_SESSION_SECRET should be configured in Vercel. The password fallback
    // keeps existing installations working until that variable is added.
    return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function toBase64Url(bytes: Uint8Array) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importSigningKey(mode: "sign" | "verify") {
    const secret = getSessionSecret();
    if (!secret) return null;

    return crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        [mode],
    );
}

export async function createAdminSession(email: string) {
    const key = await importSigningKey("sign");
    if (!key) throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD is not configured");

    const payload: SessionPayload = {
        email,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    };
    const payloadEncoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadEncoded));

    return `${payloadEncoded}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSession(token: string | undefined | null) {
    if (!token || !process.env.ADMIN_EMAIL) return false;

    try {
        const [payloadEncoded, signatureEncoded] = token.split(".");
        if (!payloadEncoded || !signatureEncoded) return false;

        const key = await importSigningKey("verify");
        if (!key) return false;

        const validSignature = await crypto.subtle.verify(
            "HMAC",
            key,
            fromBase64Url(signatureEncoded),
            new TextEncoder().encode(payloadEncoded),
        );
        if (!validSignature) return false;

        const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadEncoded))) as SessionPayload;
        return payload.email === process.env.ADMIN_EMAIL && payload.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

export async function requireAdmin() {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const valid = await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
    if (!valid) throw new Error("Unauthorized");
    return true;
}

export { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS };
