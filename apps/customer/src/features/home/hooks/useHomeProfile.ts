import { useCallback, useEffect, useState } from 'react';

import type { UserProfile } from '@/constants/app';
import { getUserProfile } from '@/lib/storage';

export function useHomeProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getUserProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, loading, refresh };
}
