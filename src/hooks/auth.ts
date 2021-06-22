import { useContext } from 'react';

import { AuthContext, AuthContextType } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAth must be within an AuthProvider.');
  }

  return context;
};
