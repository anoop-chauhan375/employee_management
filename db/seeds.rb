puts "Seeding employees..."

EmployeeSeedGenerator.call

puts "Done!"
puts "Employees count: #{Employee.count}"