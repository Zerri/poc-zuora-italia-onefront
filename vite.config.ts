import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { oneFrontApp } from "@1f/vite-plugin"

export default defineConfig({
  plugins: [react(), oneFrontApp()]
})
