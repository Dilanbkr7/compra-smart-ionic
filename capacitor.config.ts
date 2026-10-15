import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.deber2.comprasmart',
  appName: 'CompraSmart',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#101936',
      showSpinner: false,
    },
  },
};

export default config;
