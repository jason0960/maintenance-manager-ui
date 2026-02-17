import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from './Spinner';
import type { Role } from '@/types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
