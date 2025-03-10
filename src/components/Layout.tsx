import { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface LayoutProps {
  children?: ReactNode;
  user: User | null;
  supabaseUser: SupabaseUser | null;
  onLanguageChange: (language: string) => void;
}

function Layout({ user, supabaseUser, onLanguageChange }: LayoutProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800 dark:text-gray-200">HR App</Link>
          <nav>
            <ul className="flex space-x-6 items-center">
              {supabaseUser ? (
                <>
                  <li>
                    <span className="text-gray-600 dark:text-gray-400">{supabaseUser.email}</span>
                  </li>
                  <li><Link to="/profile" className="text-blue-500 hover:underline">{t('profile')}</Link></li>
                  <li><Link to="/dashboard" className="text-blue-500 hover:underline">{t('dashboard')}</Link></li>
                  {user?.role === 'superadmin' && (
                    <li><Link to="/companies" className="text-blue-500 hover:underline">Companies</Link></li>
                  )}
                  <li><button onClick={async () => await supabase.auth.signOut()} className="text-blue-500 hover:underline">{t('signOut')}</button></li>
                </>
              ) : (
                <li><Link to="/login" className="text-blue-500 hover:underline">{t('login')}</Link></li>
              )}
              <li>
                <button onClick={() => onLanguageChange('en')} className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-blue-500 dark:hover:bg-gray-600`}>EN</button>
                <button onClick={() => onLanguageChange('hu')} className={`px-3 py-1 rounded ${i18n.language === 'hu' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-blue-500 dark:hover:bg-gray-600`}>HU</button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-200 dark:bg-gray-800 text-center py-4">
        &copy; {new Date().getFullYear()} HR Management App
      </footer>
    </div>
  );
}

export default Layout;
