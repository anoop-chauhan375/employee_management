puts "Seeding employees..."

EmployeeSeedGenerator.call

puts "Creating default HR manager..."
HrManager.find_or_create_by!(email: 'hr@example.com') do |hr|
  hr.password = 'Password@123'
  hr.password_confirmation = 'Password@123'
end

puts "Done!"
puts "Employees count: #{Employee.count}"
puts "Default HR Manager created: hr@example.com"