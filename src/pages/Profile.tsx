import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, Company, Department } from '../types';
import { supabase } from '../supabaseClient';
import InputField from '../components/InputField';

function Profile({ user, supabaseUser }: { user: User | null; supabaseUser: SupabaseUser | null }) {
  const { t } = useTranslation();
  const [company, setCompany] = useState<Company | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && user.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', user.company_id)
          .single();

        if (companyError) {
          console.error("Error fetching company:", companyError);
        } else {
          setCompany(companyData as Company);
        }

        if (user.department_id) {
          const { data: departmentData, error: departmentError } = await supabase
            .from('departments')
            .select('*')
            .eq('id', user.department_id)
            .single();

          if (departmentError) {
            console.error("Error fetching department:", departmentError);
          } else {
            setDepartment(departmentData as Department);
          }
        }
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        setPhoneNumber(user.phone_number || '');
        setDateOfBirth(user.date_of_birth || '');
        setJobTitle(user.job_title || '');
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    if (!supabaseUser || !user) return;

    const { error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        job_title: jobTitle,
      })
      .eq('id', user.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(true);
      setIsEditing(false);
      // Refetch user data (optional, but good for immediate feedback)
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else if (profileData) {
        // setUser(profileData as User); // Consider using a state management solution to avoid direct prop updates
      }
    }
    setIsUpdating(false);
  };

  const handleCancelEdit = () => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhoneNumber(user.phone_number || '');
      setDateOfBirth(user.date_of_birth || '');
      setJobTitle(user.job_title || '');
    }
    setIsEditing(false);
  }

  if (!supabaseUser) {
    return <p>{t('notLoggedIn')}</p>;
  }

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>
      <div className="space-y-4">
        <div>
          <p><span className="font-semibold">{t('email')}:</span> {supabaseUser.email}</p>
          {user && (
            <>
              {!isEditing ? (
                <>
                  <p><span className="font-semibold">First Name:</span> {user.first_name}</p>
                  <p><span className="font-semibold">Last Name:</span> {user.last_name}</p>
                  {company && <p><span className="font-semibold">Company:</span> {company.name}</p>}
                  {department && <p><span className="font-semibold">Department:</span> {department.name}</p>}
                  <p><span className="font-semibold">Role:</span> {user.role}</p>
                  {user.phone_number && <p><span className="font-semibold">Phone Number:</span> {user.phone_number}</p>}
                  {user.date_of_birth && <p><span className="font-semibold">Date of Birth:</span> {user.date_of_birth}</p>}
                  {user.job_title && <p><span className="font-semibold">Job Title:</span> {user.job_title}</p>}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <InputField label="First Name" name="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <InputField label="Last Name" name="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <InputField label="Phone Number" name="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  <InputField label="Date of Birth" name="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                  <InputField label="Job Title" name="jobTitle" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

                  {updateError && <p className="text-red-500">{updateError}</p>}
                  {updateSuccess && <p className="text-green-500">Profile updated successfully!</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
