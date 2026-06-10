module Api
  module V1
    class InsightsController < BaseController
      def country_salary_stats
        return if validate_country_param!
        
        stats = SalaryInsights::CountryStatsService.new(params[:country]).call
        
        if stats
          json_success(stats)
        else
          json_error("No data found for country: #{params[:country]}", :not_found)
        end
      end

      def job_title_salary_stats
        return if validate_country_param!
        return if validate_job_title_param!

        stats = SalaryInsights::JobTitleStatsService.new(params[:country], params[:job_title]).call

        if stats
          json_success(stats)
        else
          json_error("No data found for country: #{params[:country]} and job title: #{params[:job_title]}", :not_found)
        end
      end

      def dashboard
        stats = SalaryInsights::DashboardService.new.call
        json_success(stats)
      end

      private

      def validate_country_param!
        if params[:country].blank?
          json_error("Country parameter is required", :bad_request)
          return true
        end

        unless Employee.exists?(country: params[:country])
          json_error("Country not found in records", :not_found)
          return true
        end
        false
      end

      def validate_job_title_param!
        if params[:job_title].blank?
          json_error("Job title parameter is required", :bad_request)
          return true
        end

        unless Employee.job_titles.keys.include?(params[:job_title])
          json_error("Invalid job title", :bad_request)
          return true
        end
        false
      end
    end
  end
end
