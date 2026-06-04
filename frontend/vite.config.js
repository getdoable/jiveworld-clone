import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend runs on :5173. API + media calls are proxied to the Express
// backend on :3001 so the app works from a single origin during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/media': 'http://localhost:3001',
    },
  },
});
