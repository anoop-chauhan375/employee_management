module Api
  module V1
    class CountriesController < BaseController
      def index
        country_codes = Employee.distinct.pluck(:country).compact
        
        countries = country_codes.map do |code|
          country = ISO3166::Country[code]
          next unless country
          
          { code: code, name: country.common_name || country.name }
        end.compact.sort_by { |c| c[:name] }

        render json: countries
      end
    end
  end
end
