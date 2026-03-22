import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envVariables = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@api": path.resolve(__dirname, "./src/api.ts"),
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.poiskkino.dev',
          changeOrigin: true,
          rewrite: (path) => {
            (path)
            return path.replace(/^\/api/, '')
          },
          headers: {
            'X-API-KEY': envVariables.TOKEN,
          }
        }
      }
    }
  }
})
