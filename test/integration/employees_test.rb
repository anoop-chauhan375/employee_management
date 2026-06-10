require "test_helper"

class EmployeesTest < ActionDispatch::IntegrationTest
  setup do
    @employee = employees(:one)
  end

  test "should get index" do
    get api_v1_employees_url
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
    assert json_response["data"]["employees"].is_a?(Array)
    assert json_response["data"]["pagination"].present?
  end

  test "should paginate employees" do
    get api_v1_employees_url, params: { page: 1 }
    assert_response :success
  end

  test "should filter by country" do
    get api_v1_employees_url, params: { country: "US" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["data"]["employees"].any? { |e| e["country"] == "US" }
  end

  test "should filter by job title" do
    get api_v1_employees_url, params: { job_title: "software_engineer" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["data"]["employees"].any? { |e| e["job_title"] == "software_engineer" }
  end

  test "should search by name" do
    get api_v1_employees_url, params: { name_query: "John" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["data"]["employees"].any? { |e| e["full_name"].include?("John") }
  end

  test "should search by email" do
    get api_v1_employees_url, params: { email_query: "john" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["data"]["employees"].any? { |e| e["email"].include?("john") }
  end

  test "should sort by name" do
    get api_v1_employees_url, params: { sort: "name", direction: "asc" }
    assert_response :success
  end

  test "should sort by salary" do
    get api_v1_employees_url, params: { sort: "salary", direction: "desc" }
    assert_response :success
  end

  test "should show employee" do
    get api_v1_employee_url(@employee)
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
    assert json_response["data"]["employee"]["id"] == @employee.id
  end

  test "should create employee" do
    assert_difference("Employee.count") do
      post api_v1_employees_url, params: {
        employee: {
          full_name: "Test User",
          email: "test.user@example.com",
          country: "IN",
          currency: "INR",
          job_title: "hr_manager",
          department: "hr",
          employment_type: "full_time",
          salary: 90000,
          hire_date: "2024-01-01"
        }
      }
    end
    assert_response :created
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
  end

  test "should not create employee with invalid data" do
    assert_no_difference("Employee.count") do
      post api_v1_employees_url, params: {
        employee: { full_name: "", email: "" }
      }
    end
    assert_response :unprocessable_entity
    json_response = JSON.parse(@response.body)
    assert_not json_response["success"]
    assert json_response["errors"].present?
  end

  test "should update employee" do
    patch api_v1_employee_url(@employee), params: {
      employee: { full_name: "John Updated Doe" }
    }
    assert_response :success
    @employee.reload
    assert_equal "John Updated Doe", @employee.full_name
  end

  test "should not update employee with invalid data" do
    patch api_v1_employee_url(@employee), params: {
      employee: { email: "" }
    }
    assert_response :unprocessable_entity
  end

  test "should destroy employee" do
    assert_difference("Employee.count", -1) do
      delete api_v1_employee_url(@employee)
    end
    assert_response :success
  end
end
