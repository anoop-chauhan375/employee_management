module Api
  module V1
    class EmployeesController < BaseController
      def index
        employees = Employee
                    .by_country(params[:country])
                    .by_job_title(params[:job_title])
                    .search_by_name(params[:name_query])
                    .search_by_email(params[:email_query])
                    .sorted_by(params[:sort], params[:direction])

        json_success(employees: employees.limit(25))
      end

      def show
        employee = Employee.find(params[:id])
        json_success(employee: employee)
      end

      def create
        employee = Employee.new(employee_params)

        if employee.save
          json_success({ employee: employee }, :created)
        else
          json_error(employee.errors.full_messages)
        end
      end

      def update
        employee = Employee.find(params[:id])

        if employee.update(employee_params)
          json_success(employee: employee)
        else
          json_error(employee.errors.full_messages)
        end
      end

      def destroy
        employee = Employee.find(params[:id])
        employee.destroy
        json_success(message: "Employee deleted successfully")
      end

      private

      def employee_params
        params.require(:employee).permit(
          :full_name,
          :email,
          :country,
          :currency,
          :job_title,
          :department,
          :employment_type,
          :salary,
          :hire_date
        )
      end
    end
  end
end
