import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Company, User } from '../types';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';

const CompanyList: React.FC<{ user: User | null }> = ({ user }) => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyAccessTime, setNewCompanyAccessTime] = useState('');
  const [addingCompany, setAddingCompany] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedCompanyAdmins, setSelectedCompanyAdmins] = useState<{ [companyId: string]: string[] }>({}); // companyId: [userId, userId, ...]


  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase.from('companies').select('*');
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setCompanies(data || []);
            // Initialize selectedCompanyAdmins for each company
            const initialAdmins: { [companyId: string]: string[] } = {};
            for (const company of data) {
                const { data: admins, error: adminError } = await supabase
                    .from('company_admins')
                    .select('user_id')
                    .eq('company_id', company.id);

                if (adminError) {
                    console.error("Error fetching admins for company:", company.id, adminError);
                } else if (admins) {
                    initialAdmins[company.id] = admins.map(admin => admin.user_id);
                }
            }
            setSelectedCompanyAdmins(initialAdmins);
        }

          const { data: userData, error: userError } = await supabase.from('users').select('*');
          if (userError) {
              setError(userError.message);
          } else {
              setUsers(userData || []);
          }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

    const handleAddCompany = async () => {
    setAddingCompany(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('companies')
        .insert([{ name: newCompanyName, access_time: newCompanyAccessTime }])
        .select();

      if (insertError) {
        setError(insertError.message);
      } else {
        setCompanies([...companies, data[0]]);
        setNewCompanyName('');
          setNewCompanyAccessTime('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddingCompany(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('companies').delete().eq('id', companyId);
      if (deleteError) {
        setError(deleteError.message);
      } else {
        setCompanies(companies.filter((company) => company.id !== companyId));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

    const handleAdminChange = async (companyId: string, userId: string) => {
        const updatedAdmins = [...(selectedCompanyAdmins[companyId] || [])];
        const adminIndex = updatedAdmins.indexOf(userId);

        if (adminIndex > -1) {
            // Remove admin
            updatedAdmins.splice(adminIndex, 1);
            const { error } = await supabase
                .from('company_admins')
                .delete()
                .eq('company_id', companyId)
                .eq('user_id', userId);

            if (error) {
                console.error("Error removing admin:", error);
                setError(error.message);
                return;
            }

        } else {
            // Add admin
            updatedAdmins.push(userId);
            const { error } = await supabase
                .from('company_admins')
                .insert([{ company_id: companyId, user_id: userId }]);

            if (error) {
                console.error("Error adding admin:", error);
                setError(error.message);
                return;
            }
        }
        setSelectedCompanyAdmins({ ...selectedCompanyAdmins, [companyId]: updatedAdmins });
    };


  if (!user || user.role !== 'superadmin') {
    return <div>You do not have permission to view this page.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      <div className="mb-4">
        <InputField
          label="New Company Name"
          name="newCompanyName"
          type="text"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
        />
          <InputField
            label="Access Time"
            name="newCompanyAccessTime"
            type="text"
            value={newCompanyAccessTime}
            onChange={(e) => setNewCompanyAccessTime(e.target.value)}
          />
        <button
          onClick={handleAddCompany}
          disabled={addingCompany}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {addingCompany ? 'Adding...' : 'Add Company'}
        </button>
      </div>
      <ul>
        {companies.map((company) => (
          <li key={company.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p>Access Time: {company.access_time || 'Not Set'}</p>
            <button
              onClick={() => handleDeleteCompany(company.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Delete
            </button>
            <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Company Admins:</label>
                <SelectField
                    name={`companyAdmins-${company.id}`}
                    value="" // We use a dummy value since we manage selection internally
                    onChange={(e) => handleAdminChange(company.id, e.target.value)}
                    options={users.map(user => ({ value: user.id, label: `${user.first_name} ${user.last_name} (${user.id})` }))}
                    required={false}
                />
                <div className="mt-1">
                    Selected Admins:
                    {selectedCompanyAdmins[company.id]?.length ? (
                        <ul>
                            {selectedCompanyAdmins[company.id].map(userId => {
                                const adminUser = users.find(u => u.id === userId);
                                return (
                                    <li key={userId}>
                                        {adminUser ? `${adminUser.first_name} ${adminUser.last_name} (${adminUser.id})` : `User ID: ${userId}`}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <span> None</span>
                    )}
                </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;
