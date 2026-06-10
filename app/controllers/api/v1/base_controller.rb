module Api
  module V1
    class BaseController < ActionController::API
      # include Pagy::Backend

      rescue_from ActiveRecord::RecordNotFound do |e|
        render json: { success: false, errors: [e.message] }, status: :not_found
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        render json: { success: false, errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      private

      def json_success(data = {}, status = :ok)
        render json: { success: true, data: data }, status: status
      end

      def json_error(errors, status = :unprocessable_entity)
        render json: { success: false, errors: Array(errors) }, status: status
      end
    end
  end
end
