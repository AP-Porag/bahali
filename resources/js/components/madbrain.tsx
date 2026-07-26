import React from 'react';
import { usePage } from '@inertiajs/react';

export default function FooterCredit({ text = "MB Studio" }) {
    const { url } = usePage();

    // Check if the current page is the homepage ('/' or '')
    const isHomepage = url === '/' || url === '';

    // Dynamically set rel attribute based on route
    const relAttribute = isHomepage ? 'noopener' : 'nofollow noopener';

    return (
        <p className="footer-credit">
            Built with care in partnership with our {' '}
            <a
                href="https://madbrain.dev"
                target="_blank"
                className='text-[#D8886C]'
                rel={relAttribute}
            >
                {text}
            </a>
        </p>
    );
}
