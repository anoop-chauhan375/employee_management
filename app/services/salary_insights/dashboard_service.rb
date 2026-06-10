module SalaryInsights
  class DashboardService
    def call
      {
        global_stats: {
          total_employees: Employee.count,
          total_countries: Employee.distinct.count(:country),
          total_job_titles: Employee.distinct.count(:job_title),
          overall_avg_salary: Employee.average(:salary).to_f.round(2)
        },
        highest_paying_country: highest_paying_country,
        lowest_paying_country: lowest_paying_country,
        highest_paid_job_title: highest_paid_job_title,
        lowest_paid_job_title: lowest_paid_job_title,
        country_stats: country_stats,
        department_distribution: department_distribution,
        job_title_distribution: job_title_distribution
      }
    end

    private

    def highest_paying_country
      res = Employee.group(:country).average(:salary).max_by { |_, v| v }
      return nil unless res
      { country: res[0], avg_salary: res[1].to_f.round(2) }
    end

    def lowest_paying_country
      res = Employee.group(:country).average(:salary).min_by { |_, v| v }
      return nil unless res
      { country: res[0], avg_salary: res[1].to_f.round(2) }
    end

    def highest_paid_job_title
      res = Employee.group(:job_title).average(:salary).max_by { |_, v| v }
      return nil unless res
      { job_title: res[0], avg_salary: res[1].to_f.round(2) }
    end

    def lowest_paid_job_title
      res = Employee.group(:job_title).average(:salary).min_by { |_, v| v }
      return nil unless res
      { job_title: res[0], avg_salary: res[1].to_f.round(2) }
    end

    def country_stats
      Employee.group(:country).select("country, COUNT(*) as employee_count, AVG(salary) as avg_salary")
              .each_with_object({}) do |s, h|
        h[s.country] = { employee_count: s.employee_count, avg_salary: s.avg_salary.to_f.round(2) }
      end
    end

    def department_distribution
      Employee.group(:department).count
    end

    def job_title_distribution
      Employee.group(:job_title).count
    end
  end
end
