const fs = require('fs');
const path = require('path');

async function findIds() {
    let token = '';
    const envPath = path.join(process.cwd(), '.env.local');

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/FACEBOOK_ACCESS_TOKEN=(.*)/);
        if (match) token = match[1].trim();
    }

    if (!token) {
        console.error("❌ No encontré el FACEBOOK_ACCESS_TOKEN en .env.local");
        console.log("Asegúrate de que el archivo tenga una línea así: FACEBOOK_ACCESS_TOKEN=tu_token...");
        return;
    }

    try {
        console.log("🔍 Buscando cuentas vinculadas con el token...");
        const res = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account,name&access_token=${token}`);
        const data = await res.json();

        if (data.error) {
            console.error("❌ Error de la API:", data.error.message);
            return;
        }

        if (!data.data || data.data.length === 0) {
            console.log("⚠️ No se encontraron páginas vinculadas.");
            return;
        }

        data.data.forEach(page => {
            console.log(`\n_________________________________`);
            console.log(`Página: ${page.name}`);
            if (page.instagram_business_account) {
                console.log(`✅ ID DE INSTAGRAM ENCONTRADO: ${page.instagram_business_account.id}`);
                console.log(`Copiá este número y ponelo en INSTAGRAM_BUSINESS_ACCOUNT_ID en tu .env.local`);
            } else {
                console.log(`❌ Esta página no tiene un Instagram Business vinculado.`);
            }
        });

    } catch (e) {
        console.error("❌ Error al conectar:", e.message);
    }
}

findIds();
