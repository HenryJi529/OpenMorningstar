import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {

  const isServe = command === 'serve';
  const isDev = mode === 'development';

  // 根据不同命令设置不同的基础URL
  const baseURL = isServe ? "http://localhost:8000/api/quiz/" : "https://morningstar369.com/api/quiz/";

  return {
    base: '/quiz/',
    plugins: [vue()],
    define: {
      'process.env.BASE_URL': JSON.stringify(baseURL)
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
})
