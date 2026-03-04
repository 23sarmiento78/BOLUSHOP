export interface CJProduct {
    productId: string;
    productName: string;
    productSku: string;
    productImage: string;
    productPrice: string;
    // Add other fields as needed
}

export async function fetchCJProducts(token: string) {
    // This is a placeholder for the actual CJ API call
    // Documentation: https://cjdropshipping.com/api-document/product-list.html
    try {
        const response = await fetch('https://developers.cjdropshipping.com/api2.0/product/list', {
            method: 'GET',
            headers: {
                'CJ-Access-Token': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return { success: false, error: 'Failed to fetch from CJ API' };

        const data = await response.json();
        return { success: true, data: data.data?.list || [] };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function fetchCJProductDetail(productId: string, token: string) {
    try {
        const response = await fetch(`https://developers.cjdropshipping.com/api2.0/product/details?productId=${productId}`, {
            method: 'GET',
            headers: {
                'CJ-Access-Token': token
            }
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.data;
    } catch (e) {
        return null;
    }
}


const CJ_API_BASE = "https://developers.cjdropshipping.com/api2/v1";

interface CJTokenResponse {
    code: number;
    result: boolean;
    data: {
        accessToken: string;
        accessTokenExpiryDate: string;
    };
    message: string;
}

export async function getCJAccessToken(apiKey: string) {
    try {
        const response = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ apiKey })
        });

        const data: CJTokenResponse = await response.json();
        if (data.result && data.data) {
            return data.data.accessToken;
        }
        throw new Error(data.message || "Error al obtener el token de CJ");
    } catch (error) {
        console.error("CJ Auth Error:", error);
        return null;
    }
}

export async function getCJProductDetail(productId: string, accessToken: string) {
    try {
        const response = await fetch(`${CJ_API_BASE}/product/query?pid=${productId}`, {
            method: 'GET',
            headers: {
                'CJ-Access-Token': accessToken
            }
        });

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("CJ Product Fetch Error:", error);
        return null;
    }
}

export async function getCJProductBySku(sku: string, accessToken: string) {
    try {
        const response = await fetch(`${CJ_API_BASE}/product/list?sku=${sku}`, {
            method: 'GET',
            headers: {
                'CJ-Access-Token': accessToken
            }
        });

        const data = await response.json();
        if (data.result && data.data && data.data.list && data.data.list.length > 0) {
            // Get full detail of the first match
            return getCJProductDetail(data.data.list[0].pid, accessToken);
        }
        return null;
    } catch (error) {
        console.error("CJ SKU Fetch Error:", error);
        return null;
    }
}

export async function getCJShippingCost(params: {
    startCountryCode: string;
    endCountryCode: string;
    productWeight: number;
}, accessToken: string) {
    try {
        const response = await fetch(`${CJ_API_BASE}/logistic/freightCalculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CJ-Access-Token': accessToken
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        // Return the first/cheapest shipping method found
        if (data.result && data.data && data.data.length > 0) {
            return data.data[0];
        }
        return null;
    } catch (error) {
        console.error("CJ Shipping Fetch Error:", error);
        return null;
    }
}
