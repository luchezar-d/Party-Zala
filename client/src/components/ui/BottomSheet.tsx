import { Dialog } from '@headlessui/react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function BottomSheet({ open, onClose, title, children }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0" 
        aria-hidden="true" 
      />
      
      {/* Container */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <Dialog.Panel className="mx-auto w-full max-w-screen-md rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl sm:max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between gap-3 border-b px-4 py-3 bg-white rounded-t-3xl sm:rounded-t-2xl">
            <Dialog.Title className="text-base sm:text-lg font-semibold text-gray-900">
              {title ?? 'Добави парти'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="h-10 w-10 -mr-2 rounded-full hover:bg-gray-100 active:scale-95 transition focus-ring flex items-center justify-center"
              aria-label="Затвори"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* Content */}
          <div className="max-h-[min(80vh,calc(var(--vh,1vh)*80))] overflow-y-auto px-4 py-4 sm:px-6">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
