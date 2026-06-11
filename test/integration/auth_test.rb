require "test_helper"

class Api::V1::AuthTest < ActionDispatch::IntegrationTest
  def setup
    @hr_manager = hr_managers(:one)
    @password = 'Password@123'
  end

  test "should sign in successfully" do
    post api_v1_hr_manager_session_url, params: {
      email: @hr_manager.email,
      password: @password
    }

    assert_response :success
    json_response = JSON.parse(response.body)
    assert json_response["success"]
    assert_equal @hr_manager.email, json_response["data"]["email"]
    assert response.headers.key?("access-token")
  end

  test "should return error with invalid credentials" do
    post api_v1_hr_manager_session_url, params: {
      email: @hr_manager.email,
      password: 'wrong_password'
    }

    assert_response :unauthorized
    json_response = JSON.parse(response.body)
    assert_not json_response["success"]
  end

  test "should get current user with me endpoint" do
    # Sign in first to get tokens
    post api_v1_hr_manager_session_url, params: {
      email: @hr_manager.email,
      password: @password
    }
    
    auth_headers = {
      "access-token" => response.headers["access-token"],
      "client" => response.headers["client"],
      "uid" => response.headers["uid"]
    }

    get api_v1_auth_me_url, headers: auth_headers

    assert_response :success
    json_response = JSON.parse(response.body)
    assert json_response["success"]
    assert_equal @hr_manager.email, json_response["data"]["email"]
  end

  test "should sign out successfully" do
    post api_v1_hr_manager_session_url, params: {
      email: @hr_manager.email,
      password: @password
    }
    
    auth_headers = {
      "access-token" => response.headers["access-token"],
      "client" => response.headers["client"],
      "uid" => response.headers["uid"]
    }

    delete destroy_api_v1_hr_manager_session_url, headers: auth_headers

    assert_response :success
    json_response = JSON.parse(response.body)
    assert json_response["success"]
  end

  test "should return unauthorized for protected endpoint when not logged in" do
    get api_v1_employees_url
    assert_response :unauthorized
    json_response = JSON.parse(response.body)
    assert_not json_response["success"]
  end
end
