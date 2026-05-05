import React from 'react';

export default function CustomDeleteModal({
                                              open,
                                              onClose,
                                              onConfirm,
                                              title = 'Delete Confirmation',
                                              message = 'Are you sure you want to delete this item? This action cannot be undone.',
                                          }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-md p-4">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 rounded-lg bg-transparent text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M6 6l12 12M6 18L18 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    {/* Modal content */}
                    <div className="p-6 text-center">
                        <svg
                            className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 9v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">{message}</p>

                        {/* Confirm Button */}
                        <button
                            onClick={onConfirm}
                            className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                        >
                            Yes, I'm sure
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                            No, cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
