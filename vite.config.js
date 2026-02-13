import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        subscribe: resolve(__dirname, 'subscribe.html'),
        community: resolve(__dirname, 'community.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
