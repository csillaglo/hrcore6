import { useTranslation } from 'react-i18next';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

function Home({ user, supabaseUser }: { user: User | null; supabaseUser: SupabaseUser | null }) {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('welcome')}</h1>
      {supabaseUser ? (
        <p>{t('loggedInMessage', { email: supabaseUser.email })}</p>
      ) : (
        <p>{t('pleaseLogin')}</p>
      )}
      {user && (
        <p>Role: {user.role}</p>
      )}
    </div>
  );
}

export default Home;
