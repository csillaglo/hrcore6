import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from './supabaseClient'; // Import from supabaseClient
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      setSupabaseUser(supaUser);
      if (supaUser) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', supaUser.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else if (profileData) {
          setUser(profileData as User);
        }
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user);
      const fetchProfile = async () => {
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profileData) {
            setUser(profileData as User);
          }
        } else {
          setUser(null);
        }
      };
      fetchProfile();
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} supabaseUser={supabaseUser} onLanguageChange={handleLanguageChange} />}>
          <Route index element={<Home user={user} supabaseUser={supabaseUser} />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile user={user} supabaseUser={supabaseUser} />} />
          <Route path="dashboard" element={<Dashboard user={user} supabaseUser={supabaseUser}/>} />
          <Route path="companies" element={user?.role === 'superadmin' ? <CompanyList user={user} /> : <NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
