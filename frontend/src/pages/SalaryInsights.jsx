import React from 'react';
import MainLayout from '../layouts/MainLayout';
import CountrySelect from '../components/CountrySelect';
import { insightService } from '../api/services';
import { Search, Globe, Briefcase, Users, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SalaryInsights = () => {
  const [country, setCountry] = React.useState('');
  const [jobTitle, setJobTitle] = React.useState('');
  const [countryStats, setCountryStats] = React.useState(null);
  const [jobTitleStats, setJobTitleStats] = React.useState(null);
  const [loadingCountry, setLoadingCountry] = React.useState(false);
  const [loadingJobTitle, setLoadingJobTitle] = React.useState(false);

  const fetchCountryStats = async () => {
    if (!country) return;
    setLoadingCountry(true);
    try {
      const response = await insightService.getCountryStats(country);
      setCountryStats(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || 'Failed to fetch country stats');
      setCountryStats(null);
    } finally {
      setLoadingCountry(false);
    }
  };

  const fetchJobTitleStats = async () => {
    if (!country || !jobTitle) return;
    setLoadingJobTitle(true);
    try {
      const response = await insightService.getJobTitleStats(country, jobTitle);
      setJobTitleStats(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || 'Failed to fetch job title stats');
      setJobTitleStats(null);
    } finally {
      setLoadingJobTitle(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <MainLayout title="Salary Insights">
      <div className="space-y-8">
        {/* Section A: Country Stats */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-indigo-600" />
              Country Salary Statistics
            </h3>
            <p className="text-sm text-gray-500 mt-1">Select a country to view detailed salary metrics.</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="flex-1">
                <CountrySelect
                  value={country}
                  onChange={setCountry}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={fetchCountryStats}
                disabled={loadingCountry || !country}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loadingCountry ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Analyze Country
              </button>
            </div>

            {countryStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Employee Count" value={countryStats.employee_count} icon={Users} color="blue" />
                <StatCard label="Average Salary" value={formatCurrency(countryStats.avg_salary)} icon={TrendingUp} color="green" />
                <StatCard label="Minimum Salary" value={formatCurrency(countryStats.min_salary)} icon={DollarSign} color="slate" />
                <StatCard label="Maximum Salary" value={formatCurrency(countryStats.max_salary)} icon={DollarSign} color="indigo" />
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">Select a country and click analyze to see results.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section B: Job Title Stats */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
              Job Title Salary Statistics
            </h3>
            <p className="text-sm text-gray-500 mt-1">Compare job titles within a specific country.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="sm:col-span-1">
                <CountrySelect
                  value={country}
                  onChange={setCountry}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-1">
                <select
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
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
              </div>
              <button
                onClick={fetchJobTitleStats}
                disabled={loadingJobTitle || !country || !jobTitle}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loadingJobTitle ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                Compare
              </button>
            </div>

            {jobTitleStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Average Salary</p>
                    <p className="text-3xl font-bold text-indigo-900">{formatCurrency(jobTitleStats.avg_salary)}</p>
                    <p className="text-sm text-indigo-700 mt-2 font-medium capitalize">
                      {jobTitle.replace('_', ' ')} in {country}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-indigo-200" />
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Employee Count</p>
                    <p className="text-3xl font-bold text-blue-900">{jobTitleStats.employee_count}</p>
                    <p className="text-sm text-blue-700 mt-2 font-medium">Matching records found</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-200" />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">Select both country and job title to see comparison.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    slate: 'text-slate-600 bg-slate-50',
    indigo: 'text-indigo-600 bg-indigo-50',
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default SalaryInsights;
