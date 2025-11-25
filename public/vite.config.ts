import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
      allowedHosts: ['electrical-artie-blastodermic.ngrok-free.dev']
    },
    build: {
        lib: {
            entry: 'index.html',
            formats: ['es']
        },
        rollupOptions: {
            input: {
                main: 'index.html',
            }
        }
    }
})
