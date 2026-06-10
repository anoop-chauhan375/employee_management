module SalaryInsights
  class JobTitleStatsService
    def initialize(country, job_title)
      @country = country
      @job_title = job_title
    end

    def call
      stats = Employee.where(country: @country, job_title: @job_title)
                      .select("COUNT(*) as employee_count, 
                               AVG(salary) as avg_salary")
                      .take

      return nil if stats.employee_count.zero?

      {
        country: @country,
        job_title: @job_title.titleize,
        employee_count: stats.employee_count,
        avg_salary: stats.avg_salary.to_f.round(2)
      }
    end
  end
end
