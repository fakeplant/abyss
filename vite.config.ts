import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isGithubPages = mode === 'github'

  return {
    base: isGithubPages ? '/abyss/' : '/',
    plugins: [
      react(),
      TanStackRouterVite(),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    assetsInclude: ['**/*.csv'],
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['pino-pretty', 'lokijs', 'encoding'],
    },
  }
})
