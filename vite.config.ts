import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];

  // Only enable source-tags plugin in development so production builds don't
  // require the @babel/* packages at build time.
  if (mode === 'development') {
    try {
      // @ts-ignore
      const m = await import('./.vite-source-tags.js');
      plugins.push(m.sourceTags());
    } catch {}
  }

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,

    // Reduce initial chunk size by splitting vendor libraries into manual chunks
    // and increase the warning threshold slightly so Vite doesn't spam the log.
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
              if (id.includes('framer-motion')) return 'vendor-framer'
              if (id.includes('@supabase')) return 'vendor-supabase'
              if (id.includes('lucide-react')) return 'vendor-icons'
              return 'vendor'
            }
          }
        }
      }
    }
  };
})
