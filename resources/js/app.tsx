import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { route } from 'ziggy-js';

import '../css/app.css';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),

    setup({ el, App, props }) {
        const root = createRoot(el);

        // ✅ GLOBAL route() SETUP
        const ziggy = (props as any).initialPage.props.ziggy;

        (window as any).route = (name: string, params?: any, absolute?: boolean) => route(name, params, absolute, ziggy);

        root.render(
            <StrictMode>
                <div className="font-roboto">
                    <App {...props} />
                    <Toaster position="top-right" richColors />
                </div>
            </StrictMode>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});

// Theme init
initializeTheme();
