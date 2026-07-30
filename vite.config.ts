import { defineConfig } from 'vite'

// GitHub Pages: 리포지토리명이 서브패스가 됩니다.
export default defineConfig({
  base: '/nan-2026-rpg/',
  build: {
    outDir: 'dist',
  },
})
