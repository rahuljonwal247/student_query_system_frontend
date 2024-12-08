// utils/auth.ts

import { useRouter } from 'next/router';

export const logout = () => {
  localStorage.removeItem('token');
  const router = useRouter();
  router.push('/login');
};
