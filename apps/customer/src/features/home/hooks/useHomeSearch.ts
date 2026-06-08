import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { homeSearchSchema, type HomeSearchForm } from '../schemas/home-search.schema';

export function useHomeSearch() {
  return useForm<HomeSearchForm>({
    resolver: zodResolver(homeSearchSchema),
    defaultValues: { query: '' },
    mode: 'onChange',
  });
}
