# get list of prime numbers
primes = Array.new
i = 0
while (primes.length < 10)
  if i == 2 or i == 3 or i == 5
    primes.push(i)
  elsif (i%2 != 0 and i%3 != 0 and i%5 != 0)
    primes.push(i)
  end
  i += 1
end

# create 10x10 array
table = Array.new(10) { Array.new(10, 0) } 

# loop through primes to
primes.each_with_index { |x, i|
  for j in (i).downto(0)
    table[j][i] = x * primes[j]
    table[i][j] = x * primes[j]
  end
}

# print table to output
table.each do |r|
    puts r.map { |p| p }.join(" ")
end
