import { DefaultToastOptions } from 'react-hot-toast/dist/core/types';

export const toastConfig: DefaultToastOptions = {
  position: 'top-center',
  style: {
    position: 'relative',
    top: 8,
    fontFamily: "'Roboto', sans-serif",
    color: '#29292e',
    background: '#fefefe',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  },
};
