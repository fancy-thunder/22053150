import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://20.244.56.144',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/evaluation-service'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxy Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy Response:', proxyRes.statusCode);
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy Error:', err);
          });
        }
      }
    }
  }
})
