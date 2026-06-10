require "test_helper"

class InsightsTest < ActionDispatch::IntegrationTest
  setup do
    @employee = employees(:one) # John Doe, US, software_engineer, 100000
  end

  test "should get country salary stats" do
    get api_v1_insights_country_salary_stats_url, params: { country: "US" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
    assert_equal "US", json_response["data"]["country"]
    assert json_response["data"]["employee_count"] > 0
    assert_equal 100000.0, json_response["data"]["min_salary"]
  end

  test "should return error for missing country in country stats" do
    get api_v1_insights_country_salary_stats_url
    assert_response :bad_request
  end

  test "should return error for non-existent country in country stats" do
    get api_v1_insights_country_salary_stats_url, params: { country: "ZZ" }
    assert_response :not_found
  end

  test "should get job title salary stats" do
    get api_v1_insights_job_title_salary_stats_url, params: { country: "US", job_title: "software_engineer" }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
    assert_equal "US", json_response["data"]["country"]
    assert_equal "Software Engineer", json_response["data"]["job_title"]
    assert_equal 100000.0, json_response["data"]["avg_salary"]
  end

  test "should return error for missing job title" do
    get api_v1_insights_job_title_salary_stats_url, params: { country: "US" }
    assert_response :bad_request
  end

  test "should return error for invalid job title" do
    get api_v1_insights_job_title_salary_stats_url, params: { country: "US", job_title: "invalid_title" }
    assert_response :bad_request
  end

  test "should get dashboard stats" do
    get api_v1_insights_dashboard_url
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response["success"]
    assert_equal 3, json_response["data"]["total_employees"]
    assert_equal 3, json_response["data"]["total_countries"]
    assert json_response["data"]["overall_average_salary"] > 0
    assert json_response["data"]["highest_paying_country"].present?
    assert json_response["data"]["highest_paid_job_title"].present?
    assert json_response["data"]["department_distribution"].present?
  end
end
