import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Smart kisan",

        short_name: "Kisan",

        theme_color: "#15803d",

        background_color: "#ffffff",

        display: "standalone",

        icons: [
          {
            src: "/logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },

          {
            src: "/logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
