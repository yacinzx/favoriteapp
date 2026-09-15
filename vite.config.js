import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is served from a GitHub Pages project subpath
  // (https://yacinzx.github.io/favoriteapp/), so all asset URLs must be
  // prefixed accordingly.
  base: '/favoriteapp/',
  plugins: [react()],
})
