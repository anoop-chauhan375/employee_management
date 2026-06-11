module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        protected

        def render_create_success
          render json: {
            success: true,
            data: {
              id: @resource.id,
              email: @resource.email,
              full_name: @resource.respond_to?(:first_name) ? "#{@resource.first_name} #{@resource.last_name}".strip.presence || @resource.name || "HR Manager" : @resource.email
            }
          }
        end
      end
    end
  end
end
