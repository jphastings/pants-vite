import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    }
  },
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true
  }
});
