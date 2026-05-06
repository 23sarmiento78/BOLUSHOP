const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "BoluShop Admin",
        icon: path.join(__dirname, 'public/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // URL de producción de tu panel admin
    const adminUrl = process.env.ADMIN_URL || 'https://bolushop.com/admin';

    win.loadURL(adminUrl);

    // Quitar el menú superior para que parezca una app real
    win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
