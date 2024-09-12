import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8085
  },
  resolve: {
    alias: {
      shared: `${path.resolve(__dirname, '../shared')}`
    }
  }
});
