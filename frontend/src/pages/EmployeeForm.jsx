import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import MainLayout from '../layouts/MainLayout';
import { employeeService } from '../api/services';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  employment_type: z.string().min(1, 'Employment type is required'),
  salary: z.coerce.number().min(0, 'Salary must be at least 0'),
  hire_date: z.string().min(1, 'Hire date is required'),
});

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: 'USD',
      employment_type: 'full_time',
    }
  });

  React.useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const response = await employeeService.getById(id);
          const data = response.data.data.employee;
          reset({
            ...data,
            hire_date: data.hire_date ? new Date(data.hire_date).toISOString().split('T')[0] : '',
          });
        } catch (error) {
          toast.error('Failed to load employee data');
          navigate('/employees');
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await employeeService.update(id, data);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.create(data);
        toast.success('Employee created successfully');
      }
      navigate('/employees');
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Something went wrong';
      toast.error(errorMsg);
    }
  };

  return (
    <MainLayout title={isEdit ? 'Edit Employee' : 'Create New Employee'}>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 space-y-8">
          {/* Basic Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register('full_name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="John Doe"
                />
                {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  {...register('email')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>
          </section>

          {/* Job Info */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <select
                  {...register('job_title')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.job_title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">Select Job Title</option>
                  <option value="software_engineer">Software Engineer</option>
                  <option value="senior_engineer">Senior Engineer</option>
                  <option value="staff_engineer">Staff Engineer</option>
                  <option value="engineering_manager">Engineering Manager</option>
                  <option value="product_manager">Product Manager</option>
                  <option value="designer">Designer</option>
                  <option value="qa_engineer">QA Engineer</option>
                  <option value="data_analyst">Data Analyst</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                </select>
                {errors.job_title && <p className="mt-1 text-xs text-red-500">{errors.job_title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  {...register('department')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="">Select Department</option>
                  <option value="engineering">Engineering</option>
                  <option value="product">Product</option>
                  <option value="design">Design</option>
                  <option value="qa">QA</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
                  <option value="operations">Operations</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                </select>
                {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  {...register('employment_type')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.employment_type ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
                {errors.employment_type && <p className="mt-1 text-xs text-red-500">{errors.employment_type.message}</p>}
              </div>
            </div>
          </section>

          {/* Salary & Location */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  {...register('country')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="e.g. United States"
                />
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  {...register('currency')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.currency ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="USD"
                />
                {errors.currency && <p className="mt-1 text-xs text-red-500">{errors.currency.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="number"
                  {...register('salary')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                <input
                  type="date"
                  {...register('hire_date')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.hire_date ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.hire_date && <p className="mt-1 text-xs text-red-500">{errors.hire_date.message}</p>}
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 lg:p-8 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isEdit ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </form>
    </MainLayout>
  );
};

export default EmployeeForm;
