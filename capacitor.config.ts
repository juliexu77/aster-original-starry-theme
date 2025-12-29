import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7ed49dc98baa4365adf211d9ccef80ca',
  appName: 'Aster',
  webDir: 'dist',
  server: {
    url: 'https://7ed49dc9-8baa-4365-adf2-11d9ccef80ca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Share: {
      subject: 'Baby Tracking Invite',
      dialogTitle: 'Share invite link'
    }
  }
};

export default config;