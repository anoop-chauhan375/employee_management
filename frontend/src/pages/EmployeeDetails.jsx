import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import MainLayout from '../layouts/MainLayout';
import { employeeService } from '../api/services';
import { ArrowLeft, Edit2, Trash2, Calendar, Mail, Globe, Briefcase, Building2, CreditCard, Clock } from 'lucide-react';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeService.getById(id);
        setEmployee(response.data.data.employee);
      } catch (error) {
        toast.error('Failed to load employee details');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        toast.success('Employee deleted successfully');
        navigate('/employees');
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />;
  if (!employee) return <div>Employee not found</div>;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: employee.currency }).format(val);
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to list
        </button>
        <div className="flex items-center space-x-3">
          <Link
            to={`/employees/${id}/edit`}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="h-32 bg-indigo-600" />
            <div className="px-6 pb-6">
              <div className="-mt-12 flex justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold">
                  {employee.full_name.charAt(0)}
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">{employee.full_name}</h2>
                <p className="text-sm text-gray-500 capitalize">{employee.job_title.replace('_', ' ')}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-3 text-gray-400" />
                  {employee.country}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  Hired on {formatDate(employee.hire_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 capitalize">{employee.department.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mr-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Type</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 capitalize">{employee.employment_type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-green-50 rounded-lg text-green-600 mr-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(employee.salary)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mr-4">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                  <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
            <div className="prose prose-sm text-gray-600">
              <p>Employee record created on {formatDate(employee.created_at)}. This record is used for payroll and salary benchmarking within the {employee.country} region.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetails;
