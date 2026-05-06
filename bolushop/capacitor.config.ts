import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bolushop.admin',
  appName: 'BoluShopAdmin',
  webDir: 'public',
  server: {
    url: 'https://bolushop.com/admin',
    cleartext: true
  }
};

export default config;
