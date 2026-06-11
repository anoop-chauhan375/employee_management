module Api
  module V1
    module Auth
      class TokenValidationsController < DeviseTokenAuth::TokenValidationsController
        protected

        def render_validate_token_success
          if @resource
            render json: {
              success: true,
              data: {
                id: @resource.id,
                email: @resource.email,
                full_name: @resource.respond_to?(:first_name) ? "#{@resource.first_name} #{@resource.last_name}".strip.presence || @resource.name || "HR Manager" : @resource.email
              }
            }
          else
            render json: { success: false, errors: ["User not found"] }, status: :not_found
          end
        end
      end
    end
  end
end
