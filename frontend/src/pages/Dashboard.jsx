import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MetricCard from '../components/MetricCard';
import { insightService } from '../api/services';
import { Users, Globe, Briefcase, DollarSign, TrendingUp, TrendingDown, Award, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await insightService.getDashboard();
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl border border-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-xl border border-gray-200" />
          ))}
        </div>
      </MainLayout>
    );
  }

  if (!data) return <MainLayout title="Dashboard">No data available</MainLayout>;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  const countryStats = Object.entries(data.country_stats || {}).map(([name, stats]) => ({
    name,
    avg_salary: stats.avg_salary,
    count: stats.employee_count
  }));

  const departmentData = Object.entries(data.department_distribution || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
    value
  }));

  const jobTitleData = Object.entries(data.job_title_distribution || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
    count: value
  }));

  return (
    <MainLayout title="Dashboard Overview">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Employees" value={data.global_stats?.total_employees || 0} icon={Users} color="indigo" />
        <MetricCard title="Total Countries" value={data.global_stats?.total_countries || 0} icon={Globe} color="blue" />
        <MetricCard title="Total Job Titles" value={data.global_stats?.total_job_titles || 0} icon={Briefcase} color="orange" />
        <MetricCard title="Avg Salary" value={formatCurrency(data.global_stats?.overall_avg_salary)} icon={DollarSign} color="green" />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Highest Paying Country</p>
            <p className="text-lg font-bold text-gray-900">{data.highest_paying_country?.country || 'N/A'}</p>
            <p className="text-sm text-indigo-600 font-medium">{formatCurrency(data.highest_paying_country?.avg_salary)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-red-50 rounded-full text-red-600"><TrendingDown className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Lowest Paying Country</p>
            <p className="text-lg font-bold text-gray-900">{data.lowest_paying_country?.country || 'N/A'}</p>
            <p className="text-sm text-red-600 font-medium">{formatCurrency(data.lowest_paying_country?.avg_salary)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-full text-amber-600"><Award className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Highest Paid Job Title</p>
            <p className="text-lg font-bold text-gray-900 truncate max-w-[150px]">{data.highest_paid_job_title?.job_title?.replace('_', ' ') || 'N/A'}</p>
            <p className="text-sm text-amber-600 font-medium">{formatCurrency(data.highest_paid_job_title?.avg_salary)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-full text-slate-600"><Zap className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Lowest Paid Job Title</p>
            <p className="text-lg font-bold text-gray-900 truncate max-w-[150px]">{data.lowest_paid_job_title?.job_title?.replace('_', ' ') || 'N/A'}</p>
            <p className="text-sm text-slate-600 font-medium">{formatCurrency(data.lowest_paid_job_title?.avg_salary)}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Country Salary Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryStats.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  formatter={(val) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avg_salary" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Distribution by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Distribution by Job Title</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobTitleData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={150} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
