import { oneFrontApp } from "@1f/vite-plugin"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), oneFrontApp()],
})
