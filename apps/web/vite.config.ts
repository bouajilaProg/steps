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
      manifest: {
        name: 'Steps',
        short_name: 'Steps',
        description: 'Steps web app',
        theme_color: '#111111',
        background_color: '#111111',
        display: 'standalone',
        scope: '/',
        start_url: '/'
      }
    })
  ],
})
