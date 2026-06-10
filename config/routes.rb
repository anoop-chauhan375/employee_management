Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :countries, only: [:index]
      resources :employees

      namespace :insights do
        get :country_salary_stats
        get :job_title_salary_stats
        get :dashboard
      end
    end
  end
end
