class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees do |t|
      t.string :full_name, null: false
      t.string :email, null: false
      t.integer :job_title, null: false
      t.integer :department, null: false
      t.string :country, null: false
      t.decimal :salary, precision: 12, scale: 2, null: false
      t.string :currency, limit: 3, null: false
      t.date :hire_date, null: false
      t.integer :employment_type, null: false

      t.timestamps
    end

    add_index :employees, :email, unique: true
    add_index :employees, :country
    add_index :employees, :job_title
    add_index :employees, :department
    add_index :employees, :employment_type

    add_index :employees, [:country, :job_title]
  end
end
