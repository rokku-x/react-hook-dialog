import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'
import pkg from './package.json';
import preserveDirectives from 'rollup-plugin-preserve-directives';

// Custom plugin to inject CSS into JS
function injectCss() {
    return {
        name: 'inject-css',
        enforce: 'post' as const,
        generateBundle(options: any, bundle: any) {
            const cssFiles = Object.keys(bundle).filter(key => key.endsWith('.css'));
            const cssContent = cssFiles.map(key => bundle[key].source).join('');

            if (cssContent) {
                let injectCode = `
                    if (typeof document !== 'undefined') {
                    const style = document.createElement('style');
                    style.textContent = ${JSON.stringify(cssContent)};
                    document.head.appendChild(style);
                }`;

                injectCode = injectCode.replace(/\s+/g, ' ').trim();
                const entryKeys = Object.keys(bundle).filter(key =>
                    (key === 'index.esm.js' || key === 'index.cjs.js') && bundle[key].type === 'chunk'
                );
                entryKeys.forEach(key => {
                    const chunk = bundle[key];
                    chunk.code = chunk.code + '\n' + injectCode;
                });
            }
        }
    };
}

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        react({
            jsxRuntime: 'automatic',
            jsxImportSource: 'react'
        }),
        dts({
            include: ['src/**/*'],
            exclude: ['src/main.tsx', 'src/**/*.test.*', 'src/**/*.spec.*', 'src/**/__tests__/**'],
            rollupTypes: false
        }),
        injectCss()
    ],
    build: {
        // 1. Use Terser instead of Esbuild to better preserve directives
        minify: 'terser',
        terserOptions: {
            compress: {
                directives: false,
            },
        },
        lib: {
            entry: {
                index: 'src/index.ts',
            },
            formats: ['es', 'cjs'],
            name: 'react-hook-modal',
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                ...Object.keys(pkg.peerDependencies || {})
            ],
            plugins: [preserveDirectives()],
            output: [
                {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    entryFileNames: '[name].esm.js',
                    globals: { react: 'React', 'react-dom': 'ReactDOM' }
                },
                {
                    format: 'cjs',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    entryFileNames: '[name].cjs.js',
                    globals: { react: 'React', 'react-dom': 'ReactDOM' }
                }
            ]
        }
    }
})