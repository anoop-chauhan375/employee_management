module Api
  module V1
    class AuthController < BaseController
      def me
        json_success({
          id: current_api_v1_hr_manager.id,
          email: current_api_v1_hr_manager.email,
          full_name: "#{current_api_v1_hr_manager.first_name} #{current_api_v1_hr_manager.last_name}".strip.presence || current_api_v1_hr_manager.name || "HR Manager"
        })
      end
    end
  end
end
