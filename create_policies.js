import { createClient } from '@supabase/supabase-js';

// **IMPORTANT:** Use the *service role key*, NOT the anon key, for this script.
// The service role key bypasses RLS.  You can find it in your Supabase project settings.
const supabaseUrl = 'https://bxgxlkjqlxbjbnbnuisg.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Get from environment

if (!supabaseServiceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createPolicies() {
  try {
    // Policies for 'companies'
    const { error: companiesError1 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Companies are viewable by everyone." on companies FOR SELECT USING (true);`
    });
    if (companiesError1) throw companiesError1;

    const { error: companiesError2 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can update their company." on companies FOR UPDATE USING (auth.uid() in (select user_id from company_admins where company_id = id));`
    });
    if (companiesError2) throw companiesError2;


    // Policies for 'users'
    const { error: usersError1 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Users can view their own profile." on users FOR SELECT USING (auth.uid() = id);`
    });
    if (usersError1) throw usersError1;

    const { error: usersError2 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Users can update their own profile." on users FOR UPDATE USING (auth.uid() = id);`
    });
    if (usersError2) throw usersError2;

    const { error: usersError3 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can view all users in their company." on users FOR SELECT USING (auth.uid() in (select user_id from company_admins where company_id = users.company_id));`
    });
    if (usersError3) throw usersError3;

    const { error: usersError4 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Superadmins can view all users." on users FOR SELECT USING (is_superadmin());`
    });
    if (usersError4) throw usersError4;

    // Policies for 'company_admins'
    const { error: companyAdminsError1 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can view their own company admin entries." on company_admins FOR SELECT USING (auth.uid() = user_id);`
    });
    if (companyAdminsError1) throw companyAdminsError1;

    const { error: companyAdminsError2 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Superadmins can view all company admin entries." on company_admins FOR SELECT USING (is_superadmin());`
    });
    if (companyAdminsError2) throw companyAdminsError2;

    const { error: companyAdminsError3 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Superadmins can add company admins." on company_admins FOR INSERT WITH CHECK (is_superadmin());`
    });
    if (companyAdminsError3) throw companyAdminsError3;

    // Policies for 'departments'
    const { error: departmentsError1 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can view all departments in their company." on departments FOR SELECT USING (auth.uid() in (select user_id from company_admins where company_id = departments.company_id));`
    });
    if (departmentsError1) throw departmentsError1;

    const { error: departmentsError2 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Superadmins can view all departments." on departments FOR SELECT USING (is_superadmin());`
    });
    if (departmentsError2) throw departmentsError2;

    const { error: departmentsError3 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can create departments in their company" on departments FOR INSERT WITH CHECK ( auth.uid() in (select user_id from company_admins where company_id = departments.company_id) );`
    });
    if (departmentsError3) throw departmentsError3;

    const { error: departmentsError4 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can update departments in their company" on departments FOR UPDATE USING ( auth.uid() in (select user_id from company_admins where company_id = departments.company_id) );`
    });
    if (departmentsError4) throw departmentsError4;

    const { error: departmentsError5 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can delete departments in their company" on departments FOR DELETE USING ( auth.uid() in (select user_id from company_admins where company_id = departments.company_id) );`
    });
    if (departmentsError5) throw departmentsError5;

    // Policies for 'employee_hierarchy'
    const { error: employeeHierarchyError1 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Company admins can view all hierarchy entries in their company." on employee_hierarchy FOR SELECT USING (auth.uid() in (select user_id from company_admins where company_id = employee_hierarchy.company_id));`
    });
    if (employeeHierarchyError1) throw employeeHierarchyError1;

    const { error: employeeHierarchyError2 } = await supabase.rpc('sql', {
      query: `CREATE POLICY "Superadmins can view all hierarchy entries." on employee_hierarchy FOR SELECT USING (is_superadmin());`
    });
    if (employeeHierarchyError2) throw employeeHierarchyError2;


    console.log('Policies created successfully!');
  } catch (error) {
    console.error('Error creating policies:', error);
    process.exit(1);
  }
}

createPolicies();
