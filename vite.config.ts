import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
import pkg from './package.json';
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        react(),
        dts({
            include: ['src/**/*'],
            exclude: ['src/main.tsx', 'src/**/*.test.*', 'src/**/__tests__/**'],
        }),
        {
            name: 'add-use-client-directive',
            renderChunk(code, chunk) {
                if (chunk.fileName.includes('index')) {
                    return {
                        code: `"use client";\n${code}`,
                        map: null,
                    };
                }
                return null;
            },
        },
    ],
    build: {
        minify: 'esbuild',
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => {
                const ext = format === 'es' ? 'esm' : 'cjs';
                return `${entryName}.${ext}.js`;
            }
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', ...Object.keys(pkg.peerDependencies || {})],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'zustand': 'zustand',
                }
            }
        }
    }
})