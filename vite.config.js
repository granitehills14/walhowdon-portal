import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/granitehills14/walhowdon-portal' // Replace with your GitHub repo name
});
