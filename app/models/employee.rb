class Employee < ApplicationRecord

  enum :job_title, {
    software_engineer: 0,
    senior_engineer: 1,
    staff_engineer: 2,
    engineering_manager: 3,
    product_manager: 4,
    designer: 5,
    qa_engineer: 6,
    data_analyst: 7,
    hr_manager: 8,
    finance_manager: 9
  }
  enum :department, {
    engineering: 0,
    product: 1,
    design: 2,
    qa: 3,
    hr: 4,
    finance: 5,
    operations: 6,
    sales: 7,
    marketing: 8
  }
  enum :employment_type, {
    full_time: 0,
    part_time: 1,
    contract: 2,
    intern: 3
  }

  validates :full_name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :country, presence: true
  validates :currency, presence: true, length: { is: 3 }
  validates :salary, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :hire_date, presence: true
  validates :job_title, presence: true
  validates :department, presence: true
  validates :employment_type, presence: true

  scope :by_country, ->(country) { where(country: country) if country.present? }
  scope :by_job_title, ->(job_title) { where(job_title: job_title) if job_title.present? }
  scope :search_by_name, ->(query) { where("full_name ILIKE ?", "%#{query}%") if query.present? }
  scope :search_by_email, ->(query) { where("email ILIKE ?", "%#{query}%") if query.present? }
  scope :sorted_by, ->(sort_field, sort_direction = 'asc') {
    sort_field = case sort_field&.downcase
                 when 'name' then 'full_name'
                 when 'salary' then 'salary'
                 when 'created_at' then 'created_at'
                 else 'created_at'
                 end
    sort_direction = %w[asc desc].include?(sort_direction&.downcase) ? sort_direction : 'asc'
    order("#{sort_field} #{sort_direction}")
  }
end
