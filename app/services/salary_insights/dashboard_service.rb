module SalaryInsights
  class DashboardService
    def call
      {
        total_employees: Employee.count,
        total_countries: Employee.distinct.count(:country),
        total_job_titles: Employee.distinct.count(:job_title),
        overall_average_salary: Employee.average(:salary).to_f.round(2),
        highest_paying_country: highest_paying_country,
        lowest_paying_country: lowest_paying_country,
        highest_paid_job_title: highest_paid_job_title,
        lowest_paid_job_title: lowest_paid_job_title,
        department_distribution: department_distribution
      }
    end

    private

    def highest_paying_country
      res = Employee.group(:country).average(:salary).max_by { |_, v| v }
      return nil unless res
      { country: res[0], average_salary: res[1].to_f.round(2) }
    end

    def lowest_paying_country
      res = Employee.group(:country).average(:salary).min_by { |_, v| v }
      return nil unless res
      { country: res[0], average_salary: res[1].to_f.round(2) }
    end

    def highest_paid_job_title
      res = Employee.group(:job_title).average(:salary).max_by { |_, v| v }
      return nil unless res
      { job_title: res[0].titleize, average_salary: res[1].to_f.round(2) }
    end

    def lowest_paid_job_title
      res = Employee.group(:job_title).average(:salary).min_by { |_, v| v }
      return nil unless res
      { job_title: res[0].titleize, average_salary: res[1].to_f.round(2) }
    end

    def department_distribution
      Employee.group(:department).count.transform_keys(&:titleize)
    end
  end
end
