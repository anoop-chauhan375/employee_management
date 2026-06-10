class EmployeeSeedGenerator
  BATCH_SIZE = 1000

  FIRST_NAMES = File.readlines(
    Rails.root.join("db/seeds/first_names.txt"),
    chomp: true
  )

  LAST_NAMES = File.readlines(
    Rails.root.join("db/seeds/last_names.txt"),
    chomp: true
  )

  COUNTRIES = %w[IN US CA GB DE AU].freeze

  CURRENCIES = {
    "IN" => "INR",
    "US" => "USD",
    "CA" => "CAD",
    "GB" => "GBP",
    "DE" => "EUR",
    "AU" => "AUD"
  }.freeze

  SALARY_RANGES = {
    software_engineer: 60_000..120_000,
    senior_engineer: 100_000..180_000,
    staff_engineer: 150_000..250_000,
    engineering_manager: 180_000..300_000,
    product_manager: 90_000..170_000,
    designer: 50_000..100_000,
    qa_engineer: 50_000..110_000,
    data_analyst: 60_000..120_000,
    hr_manager: 70_000..130_000,
    finance_manager: 80_000..150_000
  }.freeze

  def self.call
    new.call
  end

  def call
    start_time = Time.current
    @random = Random.new(42) # Seed for determinism

    puts "Cleaning existing employees..."
    Employee.delete_all

    puts "Generating 10,000 employees..."
    records = []

    10_000.times do |i|
      records << build_employee(i)

      if records.size >= BATCH_SIZE
        Employee.insert_all(records)
        records.clear
        print "." if (i + 1) % (BATCH_SIZE * 2) == 0
      end
    end

    Employee.insert_all(records) if records.any?
    puts "\nSeed completed in #{(Time.current - start_time).round(2)} seconds"
  end

  private

  def build_employee(index)
    first_name = FIRST_NAMES[@random.rand(FIRST_NAMES.size)]
    last_name = LAST_NAMES[@random.rand(LAST_NAMES.size)]

    full_name = "#{first_name} #{last_name}"

    country = COUNTRIES[@random.rand(COUNTRIES.size)]

    job_title_keys = Employee.job_titles.keys
    job_title = job_title_keys[@random.rand(job_title_keys.size)]

    department_keys = Employee.departments.keys
    department = department_keys[@random.rand(department_keys.size)]

    employment_type_keys = Employee.employment_types.keys
    employment_type = employment_type_keys[@random.rand(employment_type_keys.size)]

    # Deterministic hire date within the last 10 years
    days_ago = @random.rand(0..3650)
    hire_date = Date.current - days_ago.days

    {
      full_name: full_name,
      email: "#{first_name.downcase}.#{last_name.downcase}.#{index + 1}@example.com",

      country: country,
      currency: CURRENCIES[country],

      job_title: job_title,
      department: department,
      employment_type: employment_type,

      salary: @random.rand(SALARY_RANGES[job_title.to_sym]),

      hire_date: hire_date,

      created_at: Time.current,
      updated_at: Time.current
    }
  end
end