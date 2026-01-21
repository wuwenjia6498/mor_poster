import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // 允许从任何主机访问
    allowedHosts: [
      'enforcedly-paramorphous-rayford.ngrok-free.dev',
      '.ngrok-free.dev', // 允许所有 ngrok 域名
    ],
  },
})

