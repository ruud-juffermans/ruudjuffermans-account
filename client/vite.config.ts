import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3004,
    proxy: {
      // Dev: forward API calls to the local platform server so the session
      // cookie stays same-origin (VITE_API_URL stays unset → base '').
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
