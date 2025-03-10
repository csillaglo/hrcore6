export interface Company {
  id: string;
  name: string;
  created_at: string;
  access_time?: string | null; // Added access_time
}

export interface User {
  id: string;
  company_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'superadmin' | 'company_admin' | 'manager' | 'employee' | null;
  preferred_language: 'en' | 'hu' | null;
  created_at: string;
  phone_number?: string | null;
  date_of_birth?: string | null; // Format: YYYY-MM-DD
  hire_date?: string | null;     // Format: YYYY-MM-DD
  job_title?: string | null;
  department_id?: string | null;
}

export interface CompanyAdmin {
  id: string;
  user_id: string;
  company_id: string;
  created_at: string;
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  created_at: string;
}

export interface EmployeeHierarchy {
  id: string;
  employee_id: string;
  manager_id: string;
  company_id: string;
  created_at: string;
}
