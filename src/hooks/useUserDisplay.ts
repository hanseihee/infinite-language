import { useCallback } from 'react';
import type { User } from '@supabase/supabase-js';

interface UserProgress {
  id: string;
  user_id: string;
  difficulty: string;
  score: number;
  rank: number;
  user_info?: {
    email: string;
    raw_user_meta_data: {
      name?: string;
      full_name?: string;
      email?: string;
      avatar_url?: string;
    };
  };
}

interface UseUserDisplayReturn {
  getUserDisplayName: (userProgress: UserProgress) => string;
  getRankIcon: (rank: number) => string;
}

export function useUserDisplay(user: User | null): UseUserDisplayReturn {
  const getUserDisplayName = useCallback((userProgress: UserProgress): string => {
    // 현재 로그인한 사용자인 경우, AuthContext의 사용자 정보 사용
    if (user && userProgress.user_id === user.id) {
      const metadata = user.user_metadata;
      if (metadata?.name) return metadata.name;
      if (metadata?.full_name) return metadata.full_name;
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    
    // API에서 사용자 정보가 있는 경우 사용
    const userInfo = userProgress.user_info;
    if (userInfo) {
      const metadata = userInfo.raw_user_meta_data;
      if (metadata?.name) return metadata.name;
      if (metadata?.full_name) return metadata.full_name;
      if (userInfo.email) {
        return userInfo.email.split('@')[0];
      }
    }
    
    return '익명 사용자';
  }, [user]);

  const getRankIcon = useCallback((rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}위`;
    }
  }, []);

  return {
    getUserDisplayName,
    getRankIcon,
  };
}