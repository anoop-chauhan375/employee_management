# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_10_115454) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "employees", force: :cascade do |t|
    t.string "country", null: false
    t.datetime "created_at", null: false
    t.string "currency", limit: 3, null: false
    t.integer "department", null: false
    t.string "email", null: false
    t.integer "employment_type", null: false
    t.string "full_name", null: false
    t.date "hire_date", null: false
    t.integer "job_title", null: false
    t.decimal "salary", precision: 12, scale: 2, null: false
    t.datetime "updated_at", null: false
    t.index ["country", "job_title"], name: "index_employees_on_country_and_job_title"
    t.index ["country"], name: "index_employees_on_country"
    t.index ["department"], name: "index_employees_on_department"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employment_type"], name: "index_employees_on_employment_type"
    t.index ["job_title"], name: "index_employees_on_job_title"
  end

  create_table "hr_managers", force: :cascade do |t|
    t.boolean "allow_password_change", default: false
    t.datetime "confirmation_sent_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "image"
    t.string "last_name"
    t.string "name"
    t.string "nickname"
    t.string "provider", default: "email", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.json "tokens"
    t.string "uid", default: "", null: false
    t.string "unconfirmed_email"
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_hr_managers_on_confirmation_token", unique: true
    t.index ["email"], name: "index_hr_managers_on_email", unique: true
    t.index ["reset_password_token"], name: "index_hr_managers_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_hr_managers_on_uid_and_provider", unique: true
  end
end
