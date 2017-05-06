from lxml import html
import requests


months = 'January, February, March, April, May, June, July, August, September, October, November, December'.split(', ')
years = range(2000, 2016)

output_name = "headlines.txt"


with open(output_name, 'w') as output:
	for year in years:
		for month in months:
			url = 'https://en.wikipedia.org/wiki/Portal:Current_events/' + month + '_' + str(year)
			print "Processing", url
			page = requests.get(url)

			tree = html.fromstring(page.content)

			items = tree.xpath('//td[@class="description"]/ul/li')
			for i in items[0:10]:
				s = i.text_content().replace('\n', '').strip().encode('utf8')
				if s:
					output.write(s)
					output.write('\n')

