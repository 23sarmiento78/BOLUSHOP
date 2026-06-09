const BREVO_API_URL = "https://api.brevo.com/v3";
const NEWSLETTER_LIST_NAME = "BoluShop Newsletter";

export interface NewsletterCampaignProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
}

export interface NewsletterCampaign {
    subject: string;
    bannerUrl?: string;
    content: string;
    collectionId?: string;
    collectionName?: string;
    collectionDescription?: string;
    products?: NewsletterCampaignProduct[];
}

function getApiKey(): string {
    const key = process.env.BREVO_API_KEY;
    if (!key) {
        throw new Error("BREVO_API_KEY no está configurada en las variables de entorno.");
    }
    return key;
}

function getSender() {
    return {
        name: process.env.BREVO_SENDER_NAME || "BoluShop",
        email:
            process.env.BREVO_SENDER_EMAIL ||
            process.env.ADMIN_EMAIL ||
            "contacto@bolushop.com",
    };
}

async function brevoRequest<T = Record<string, unknown>>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${BREVO_API_URL}${path}`, {
        ...options,
        headers: {
            "api-key": getApiKey(),
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(options.headers || {}),
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        const message =
            data.message ||
            data.error ||
            (Array.isArray(data.code) ? data.code.join(", ") : data.code) ||
            `Error Brevo (${response.status})`;
        throw new Error(message);
    }

    return data as T;
}

function buildProductsBlock(products: NewsletterCampaignProduct[], siteUrl: string): string {
    if (!products.length) return "";

    let tableRows = "";
    for (let i = 0; i < products.length; i += 2) {
        const p1 = products[i];
        const p2 = products[i + 1];
        tableRows += `<tr>
            <td style="width: 50%; padding: 8px; vertical-align: top;">
                <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <a href="${siteUrl}/producto/${p1.slug}" style="text-decoration: none; color: inherit;">
                        <img src="${p1.image}" alt="${p1.name}" style="width: 100%; height: 140px; object-fit: contain; background: #f8f9fb; display: block;" />
                        <div style="padding: 12px;">
                            <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #0a1628;">${p1.name}</p>
                            <p style="margin: 0; font-size: 15px; font-weight: 700; color: #ff6b35;">$${p1.price.toLocaleString("es-AR")}</p>
                        </div>
                    </a>
                </div>
            </td>
            ${
                p2
                    ? `<td style="width: 50%; padding: 8px; vertical-align: top;">
                <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <a href="${siteUrl}/producto/${p2.slug}" style="text-decoration: none; color: inherit;">
                        <img src="${p2.image}" alt="${p2.name}" style="width: 100%; height: 140px; object-fit: contain; background: #f8f9fb; display: block;" />
                        <div style="padding: 12px;">
                            <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #0a1628;">${p2.name}</p>
                            <p style="margin: 0; font-size: 15px; font-weight: 700; color: #ff6b35;">$${p2.price.toLocaleString("es-AR")}</p>
                        </div>
                    </a>
                </div>
            </td>`
                    : `<td style="width: 50%; padding: 8px;"></td>`
            }
        </tr>`;
    }

    return `
        <div style="margin-top: 32px;">
            <p style="text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #ff6b35; margin-bottom: 16px;">Productos destacados</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                ${tableRows}
            </table>
        </div>
    `;
}

export function buildNewsletterHtml(campaign: NewsletterCampaign): string {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bolushop.com";
    const year = new Date().getFullYear();

    const collectionBlock = campaign.collectionId
        ? `
            <div style="background-color: #F8FAFC; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #E2E8F0; margin-top: 32px;">
                <p style="text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #ff6b35; margin-bottom: 8px;">Colección destacada</p>
                ${campaign.collectionName ? `<h3 style="margin: 0 0 8px; font-size: 18px; color: #0a1628;">${campaign.collectionName}</h3>` : ""}
                ${campaign.collectionDescription ? `<p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">${campaign.collectionDescription}</p>` : ""}
                <a href="${siteUrl}/productos?coleccion=${campaign.collectionId}" style="display: inline-block; background-color: #0a1628; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Ver Colección</a>
            </div>
        `
        : "";

    const productsBlock = campaign.products?.length
        ? buildProductsBlock(campaign.products, siteUrl)
        : "";

    const bannerBlock = campaign.bannerUrl
        ? `<img src="${campaign.bannerUrl}" alt="BoluShop" style="width: 100%; height: auto; display: block;" />`
        : "";

    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${campaign.subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7;">
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
                ${bannerBlock}
                <div style="padding: 40px 32px;">
                    <div style="width: 48px; height: 4px; background: #ff6b35; border-radius: 2px; margin-bottom: 24px;"></div>
                    <h1 style="color: #0a1628; font-size: 24px; font-weight: 700; margin: 0 0 24px; line-height: 1.3;">${campaign.subject}</h1>
                    <p style="color: #475569; font-size: 16px; line-height: 1.7; white-space: pre-line; margin: 0 0 32px;">${campaign.content}</p>
                    ${productsBlock}
                    ${collectionBlock}
                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                        <div style="width: 36px; height: 36px; background: #0a1628; border-radius: 8px; color: white; font-weight: 700; font-size: 16px; line-height: 36px; margin: 0 auto 12px;">B</div>
                        <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">
                            BoluShop Argentina · ${year}
                        </p>
                        <p style="font-size: 12px; margin: 0;">
                            <a href="{{ mirror }}" style="color: #64748b; text-decoration: underline;">Ver en el navegador</a>
                            &nbsp;·&nbsp;
                            <a href="{{ unsubscribe }}" style="color: #64748b; text-decoration: underline;">Desuscribirme</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
}

let cachedListId: number | null = null;

export async function getOrCreateNewsletterListId(): Promise<number> {
    if (process.env.BREVO_LIST_ID) {
        return parseInt(process.env.BREVO_LIST_ID, 10);
    }

    if (cachedListId) return cachedListId;

    const { lists } = await brevoRequest<{ lists: { id: number; name: string }[] }>(
        "/contacts/lists?limit=50&offset=0"
    );

    const existing = lists?.find((list) => list.name === NEWSLETTER_LIST_NAME);
    if (existing) {
        cachedListId = existing.id;
        return existing.id;
    }

    const created = await brevoRequest<{ id: number }>("/contacts/lists", {
        method: "POST",
        body: JSON.stringify({ name: NEWSLETTER_LIST_NAME }),
    });

    cachedListId = created.id;
    return created.id;
}

export async function addContactToNewsletter(email: string): Promise<void> {
    const listId = await getOrCreateNewsletterListId();

    await brevoRequest("/contacts", {
        method: "POST",
        body: JSON.stringify({
            email: email.toLowerCase().trim(),
            listIds: [listId],
            updateEnabled: true,
        }),
    });
}

export async function removeContactFromNewsletter(email: string): Promise<void> {
    const encoded = encodeURIComponent(email.toLowerCase().trim());

    try {
        await brevoRequest(`/contacts/${encoded}?identifierType=email_id`, {
            method: "DELETE",
        });
    } catch (error) {
        // Si el contacto no existe en Brevo, no es un error crítico
        const message = error instanceof Error ? error.message : "";
        if (!message.toLowerCase().includes("not found")) {
            throw error;
        }
    }
}

export async function syncSubscribersToBrevo(emails: string[]): Promise<void> {
    const uniqueEmails = [...new Set(emails.map((e) => e.toLowerCase().trim()))];

    for (const email of uniqueEmails) {
        try {
            await addContactToNewsletter(email);
        } catch (error) {
            console.error(`❌ Brevo sync error for ${email}:`, error);
        }
    }
}

export async function sendNewsletterCampaign(
    campaign: NewsletterCampaign,
    subscriberEmails: string[]
): Promise<{ campaignId: number; recipientCount: number }> {
    if (subscriberEmails.length === 0) {
        throw new Error("No hay suscriptores para enviar la campaña.");
    }

    await syncSubscribersToBrevo(subscriberEmails);

    const listId = await getOrCreateNewsletterListId();
    const htmlContent = buildNewsletterHtml(campaign);
    const sender = getSender();
    const campaignName = `BoluShop - ${campaign.subject} - ${new Date().toISOString().slice(0, 16)}`;

    const created = await brevoRequest<{ id: number }>("/emailCampaigns", {
        method: "POST",
        body: JSON.stringify({
            name: campaignName,
            subject: campaign.subject,
            sender,
            type: "classic",
            htmlContent,
            recipients: {
                listIds: [listId],
            },
        }),
    });

    await brevoRequest(`/emailCampaigns/${created.id}/sendNow`, {
        method: "POST",
    });

    return {
        campaignId: created.id,
        recipientCount: subscriberEmails.length,
    };
}

export async function sendTestNewsletterEmail(
    campaign: NewsletterCampaign,
    testEmail: string
): Promise<void> {
    const email = testEmail.toLowerCase().trim();
    if (!email.includes("@")) {
        throw new Error("Email de prueba inválido.");
    }

    const htmlContent = buildNewsletterHtml(campaign);
    const sender = getSender();

    await brevoRequest("/smtp/email", {
        method: "POST",
        body: JSON.stringify({
            sender,
            to: [{ email }],
            subject: `[PRUEBA] ${campaign.subject}`,
            htmlContent,
        }),
    });
}

export async function isBrevoConfigured(): Promise<boolean> {
    return Boolean(process.env.BREVO_API_KEY);
}
