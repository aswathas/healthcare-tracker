import toast from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const showToast = (message: string, type: ToastType = 'info') => {
    const options = {
      duration: 4000,
      position: 'top-right' as const,
    };

    switch (type) {
      case 'success':
        toast.success(message, {
          ...options,
          style: {
            background: '#059669',
            color: '#fff',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          ...options,
          duration: 5000,
          style: {
            background: '#DC2626',
            color: '#fff',
          },
        });
        break;
      default:
        toast(message, {
          ...options,
          style: {
            background: '#333',
            color: '#fff',
          },
        });
    }
  };

  return { showToast };
};
