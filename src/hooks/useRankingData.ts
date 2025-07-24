import { useState, useEffect, useCallback } from 'react';
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

interface RankingData {
  [difficulty: string]: UserProgress[];
}

interface UseRankingDataReturn {
  rankingData: RankingData;
  userRanks: { [key: string]: number };
  isLoading: boolean;
  error: string | null;
  refetchRankingData: () => Promise<void>;
}

export function useRankingData(user: User | null): UseRankingDataReturn {
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [userRanks, setUserRanks] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = user 
        ? `/api/ranking?user_id=${user.id}`
        : '/api/ranking';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRankingData(data.data);
        if (data.user_ranks) {
          setUserRanks(data.user_ranks);
        }
      } else {
        setError(data.error || '랭킹 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  return {
    rankingData,
    userRanks,
    isLoading,
    error,
    refetchRankingData: fetchRankingData,
  };
}