import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import Table from './Table';
import { useTranslation } from 'react-i18next';

interface EmployeeListProps {
  user: User | null;
  supabaseUser: any;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ user, supabaseUser }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!supabaseUser || !user) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from('users').select('*');

        if (user.role === 'company_admin') {
          query = query.eq('company_id', user.company_id);
        } else if (user.role === 'superadmin') {
          // No company filter for superadmin
        } else {
            //TODO: implement manager and employee
            setLoading(false);
            return;
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setEmployees(data || []);
        }
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [supabaseUser, user]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employees.length) {
    return <div>{t('noEmployeesFound')}</div>;
  }

  const headers = [t('firstName'), t('lastName'), t('email'), t('role')];
  const data = employees.map((employee) => [
    employee.first_name || '',
    employee.last_name || '',
    employee.id, // Using Supabase user ID for email to prevent null value issues
    employee.role || '',
  ]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('employeeList')}</h2>
      <Table headers={headers} data={data} />
    </div>
  );
};

export default EmployeeList;
