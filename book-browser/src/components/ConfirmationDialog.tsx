import type { ReactNode } from 'react';

type ConfirmationDialogProps = {
    isOpen: boolean;
    title: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'neutral';
};

const variantStyles: Record<string, string> = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    neutral: 'bg-pink-500 hover:bg-pink-600 text-white',
};

export const ConfirmationDialog = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'neutral',
}: ConfirmationDialogProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <div className="text-gray-600 mb-6">{message}</div>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                        onClick={e => {
                            e.stopPropagation();
                            onCancel();
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded font-medium transition ${variantStyles[variant]}`}
                        onClick={e => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};