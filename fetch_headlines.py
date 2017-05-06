from lxml import html
import requests


months = 'January, February, March, April, May, June, July, August, September, October, November, December'.split(', ')
years = range(2000, 2016)

output_name = "headlines.txt"


with open(output_name, 'w') as output:
	for year in years:
		for month in months:
			page = requests.get('https://en.wikipedia.org/wiki/Portal:Current_events/April_2016')
			tree = html.fromstring(page.content)

			items = tree.xpath('//td[@class="description"]/ul/li')
			for i in items[0:10]:
				s = i.text_content().replace('\n', '').strip().encode('utf8')
				if s:
					output.write(s)
					output.write('\n')



# from bs4 import BeautifulSoup

# data = ""
# with open('/tmp/wiki.html', 'r') as myfile:
#     data=myfile.read().replace('\n', '')

# soup = BeautifulSoup(data)

# inner_ul = soup.find('ul', class_='innerUl')
# inner_items = [li.text.strip() for li in inner_ul.ul.find_all('li')]

# outer_ul_text = soup.ul.span.text.strip()
# inner_ul_text = inner_ul.span.text.strip()

# result = {outer_ul_text: {inner_ul_text: inner_items}}
# print result