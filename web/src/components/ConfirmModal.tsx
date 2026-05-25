import type { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'success' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  type = 'success',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/20';
      case 'success':
        return 'bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] focus:ring-[#2ecc71]/20';
      case 'info':
      default:
        return 'bg-[#3b82f6] hover:bg-[#2563eb] text-white focus:ring-[#3b82f6]/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            className="cursor-pointer text-gray-400 transition-colors hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="text-sm text-gray-300">{message}</div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 p-5">
          <button
            className="cursor-pointer rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white disabled:opacity-50"
            disabled={isLoading}
            type="button"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition-all focus:ring-2 disabled:opacity-50 ${getButtonColor()}`}
            disabled={isLoading}
            type="button"
            onClick={onConfirm}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
