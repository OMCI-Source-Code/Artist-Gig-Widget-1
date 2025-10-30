import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist/embed', 
    lib: {
      entry: resolve(__dirname, 'src/embed.js'), 
      name: 'ArtistGigWidget',                   
      fileName: 'embed',                         
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
