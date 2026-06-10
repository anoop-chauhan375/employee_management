module SalaryInsights
  class CountryStatsService
    def initialize(country)
      @country = country
    end

    def call
      stats = Employee.where(country: @country)
                      .select("COUNT(*) as employee_count, 
                               MIN(salary) as min_salary, 
                               MAX(salary) as max_salary, 
                               AVG(salary) as avg_salary")
                      .take

      return nil if stats.employee_count.zero?

      {
        country: @country,
        employee_count: stats.employee_count,
        min_salary: stats.min_salary.to_f.round(2),
        max_salary: stats.max_salary.to_f.round(2),
        avg_salary: stats.avg_salary.to_f.round(2)
      }
    end
  end
end
