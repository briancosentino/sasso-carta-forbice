import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  build: {
    // Ottimizzazioni di build per performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Rimuove console.log in produzione
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Rimuove specifiche funzioni console
      },
    },
    rollupOptions: {
      output: {
        // Code splitting per chunks ottimali
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/gameLogic.ts', './src/types.ts']
        }
      }
    },
    // Ottimizzazioni chunk size
    chunkSizeWarningLimit: 1000,
    // Source maps solo in sviluppo
    sourcemap: false,
  },
  // Ottimizzazioni per sviluppo
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
