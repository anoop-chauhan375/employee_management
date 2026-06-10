require "test_helper"

class Api::V1::CountriesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_countries_url
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_kind_of Array, json_response
    
    # Verify structure
    if json_response.any?
      assert json_response.first.key?("code")
      assert json_response.first.key?("name")
    end
  end

  test "returns only countries with employees" do
    # Assuming fixtures have employees from specific countries
    get api_v1_countries_url
    json_response = JSON.parse(response.body)
    
    codes_in_response = json_response.map { |c| c["code"] }
    codes_in_db = Employee.distinct.pluck(:country).compact
    
    assert_equal codes_in_db.sort, codes_in_response.sort
  end
end
