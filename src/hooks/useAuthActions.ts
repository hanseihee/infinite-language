import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthActionsProps {
  onAction?: () => void;
}

interface UseAuthActionsReturn {
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export function useAuthActions({ onAction }: UseAuthActionsProps = {}): UseAuthActionsReturn {
  const { signInWithGoogle, signOut } = useAuth();

  const handleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
      onAction?.();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  }, [signInWithGoogle, onAction]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      onAction?.();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut, onAction]);

  return {
    handleSignIn,
    handleSignOut,
  };
}