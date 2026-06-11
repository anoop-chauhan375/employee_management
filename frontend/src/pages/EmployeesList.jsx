import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { employeeService } from '../api/services';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, MoreVertical, Eye, Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EmployeesList = () => {
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [params, setParams] = React.useState({
    name_query: '',
    country: '',
    job_title: '',
    sort: 'created_at',
    direction: 'desc',
    page: 1
  });

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAll(params);
      setEmployees(response.data.data.employees);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(timer);
  }, [params]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleSort = (field) => {
    setParams(prev => ({
      ...prev,
      sort: field,
      direction: prev.sort === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 lg:p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={params.name_query}
                onChange={(e) => setParams({ ...params, name_query: e.target.value })}
              />
            </div>
            <select
              className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={params.job_title}
              onChange={(e) => setParams({ ...params, job_title: e.target.value })}
            >
              <option value="">All Job Titles</option>
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
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/employees/new"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4 cursor-pointer hover:text-gray-900" onClick={() => handleSort('job_title')}>
                  <div className="flex items-center">Job Title <ArrowUpDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4 cursor-pointer hover:text-gray-900" onClick={() => handleSort('salary')}>
                  <div className="flex items-center">Salary <ArrowUpDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4 h-16 bg-gray-50/50" />
                  </tr>
                ))
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                          {employee.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{employee.job_title.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.country}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(employee.salary)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {employee.department.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => navigate(`/employees/${employee.id}`)} className="p-1 text-gray-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate(`/employees/${employee.id}/edit`)} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(employee.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {employees.length} results</p>
          <div className="flex items-center space-x-2">
            <button
              disabled={params.page === 1}
              className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600 disabled:opacity-50"
              onClick={() => setParams({ ...params, page: params.page - 1 })}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 px-4">Page {params.page}</span>
            <button
              className="p-2 border border-gray-300 rounded-lg bg-white text-gray-600"
              onClick={() => setParams({ ...params, page: params.page + 1 })}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeesList;
