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

    // More aggressive vendor-splitting to reduce the size of the main chunk.
    // Also increase warning threshold slightly so Vite only warns for very large bundles.
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              // Core React libs
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
              // Routing
              if (id.includes('react-router-dom')) return 'vendor-router'
              // Motion/animation
              if (id.includes('framer-motion')) return 'vendor-framer'
              // Supabase
              if (id.includes('@supabase')) return 'vendor-supabase'
              // Icons / UI
              if (id.includes('lucide-react')) return 'vendor-icons'
              // Tailwind runtime helpers (if present)
              if (id.includes('tailwindcss')) return 'vendor-tailwind'
              // Everything else from node_modules
              return 'vendor'
            }
          }
        }
      }
    }
  };
})
