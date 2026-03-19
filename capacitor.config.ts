import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kidslearning.app',
  appName: 'Kids Learning App',
  webDir: 'dist',
  server: {
    androidScheme: 'https' 
  }
};

export default config;