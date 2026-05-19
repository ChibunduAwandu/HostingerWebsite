import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules/@react-three/postprocessing') >= 0 || id.indexOf('node_modules/postprocessing') >= 0) {
            return 'fx-stack';
          }

          if (id.indexOf('node_modules/@react-three/drei') >= 0) {
            return 'drei-stack';
          }

          if (id.indexOf('node_modules/@react-three/fiber') >= 0) {
            return 'r3f-stack';
          }

          if (id.indexOf('node_modules/three') >= 0) {
            return 'three-core';
          }

          if (id.indexOf('node_modules/gsap') >= 0) {
            return 'motion-stack';
          }

          if (id.indexOf('node_modules/lucide-react') >= 0) {
            return 'icon-stack';
          }

          if (id.indexOf('node_modules/react') >= 0) {
            return 'react-stack';
          }

          return undefined;
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
