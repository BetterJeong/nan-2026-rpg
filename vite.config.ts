import { defineConfig } from 'vite'

// 상대 경로 base: GitHub Pages 서브패스와 로컬 파일 열기 모두 동작합니다.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
  },
})
