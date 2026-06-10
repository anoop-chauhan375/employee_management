import React from 'react';
import { insightService } from '../api/services';
import { Loader2, AlertCircle } from 'lucide-react';

const CountrySelect = ({ value, onChange, disabled, className = "" }) => {
  const [countries, setCountries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await insightService.getCountries();
        setCountries(response.data);
      } catch (err) {
        setError('Failed to load countries');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="relative">
        <select disabled className={`${className} opacity-50 cursor-not-allowed`}>
          <option>Loading countries...</option>
        </select>
        <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <select disabled className={`${className} border-red-300 text-red-500`}>
          <option>{error}</option>
        </select>
        <AlertCircle className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
    >
      <option value="">Select Country</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;
