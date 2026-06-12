import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
      optimizeDeps: {
      include: ['react-map-gl', 'mapbox-gl'],
    },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/')) {
              return 'react-vendor';
            }
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
});