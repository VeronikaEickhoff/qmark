

filename = "headlines.txt"
with open(filename, 'r') as input:
	for line in input.readlines():
		for sentence in line.split('.'):
			s = sentence.strip()
			if len(s) > 10 and s[0].isalnum():
				print s
