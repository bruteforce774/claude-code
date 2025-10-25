import { defineConfig } from 'vite';

export default defineConfig({
  // Proxy API requests to Express server during development
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
