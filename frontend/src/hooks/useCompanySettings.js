import { useQuery } from '@tanstack/react-query';
import { dbService } from '../services/dbService';

export const useCompanySettings = () => {
  const { data: companySettings, isLoading, error } = useQuery({
    queryKey: ['settings-general'],
    queryFn: dbService.getSettings,
    staleTime: 1000 * 60 * 5,
    retry: 1
  });

  const logoUrl = companySettings?.logoUrl || '/kiaan-logo.svg';
  const companyName = companySettings?.companyName || 'Kiaan Technology CRM';

  return {
    companySettings,
    logoUrl,
    companyName,
    isLoading,
    error
  };
};

export default useCompanySettings;

