class AddNamesToHrManagers < ActiveRecord::Migration[8.1]
  def change
    add_column :hr_managers, :first_name, :string
    add_column :hr_managers, :last_name, :string
  end
end
