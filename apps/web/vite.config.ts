import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Steps',
        short_name: 'Steps',
        description: 'Steps web app',
        theme_color: '#f6f2ea',
        background_color: '#f6f2ea',
        display: 'standalone',
        scope: '/',
        start_url: '/'
      }
    })
  ],
})
