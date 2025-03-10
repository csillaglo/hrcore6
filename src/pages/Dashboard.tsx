import React from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';
import EmployeeList from '../components/EmployeeList';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
    user: User | null;
    supabaseUser: SupabaseUser | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user, supabaseUser }) => {
    const { t } = useTranslation();

    if (!supabaseUser || !user) {
        return <div>{t('pleaseLogin')}</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{t('dashboard')}</h1>
            <EmployeeList user={user} supabaseUser={supabaseUser} />
        </div>
    )
};

export default Dashboard;
