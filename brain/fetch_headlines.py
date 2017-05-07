from lxml import html
import requests


# months = 'January, February, March, April, May, June, July, August, September, October, November, December'.split(', ')
# years = range(2000, 2016)

# output_name = "headlines.txt"


# with open(output_name, 'w') as output:
#   for year in years:
#       for month in months:
#           url = 'https://en.wikipedia.org/wiki/Portal:Current_events/' + month + '_' + str(year)
#           print "Processing", url
#           page = requests.get(url)

#           tree = html.fromstring(page.content)

#           items = tree.xpath('//td[@class="description"]/ul/li')
#           for i in items[0:10]:
#               s = i.text_content().replace('\n', '').strip().encode('utf8')
#               if s:
#                   output.write(s)
#                   output.write('\n')

# months = 'January, February, March, April, May, June, July, August, September, October, November, December'.split(', ')
# years = range(2000, 2016)

output_name = "telegraph.txt"

with open(output_name, 'w') as output:
    for year in range(2000, 2018):
        for month in range(1, 13):
            for day in range(1, 32):
                url = 'http://www.telegraph.co.uk/archive/%i-%i-%i.html' % (year, month, day)
                response = requests.get(url)
                if response.ok:
                    print "Processing", url
                    tree = html.fromstring(response.content)
                    items = tree.xpath('//div[@class="summary"]/h3/a')
                    for i in items:
                        s = i.text_content().replace('\n', '').strip().encode('utf8')
                        if s and not s.isupper():
                            print s
                            output.write(s)
                            output.write('\n')

    # for start in range(0, 100, 10):
    #     url = "https://www.google.de/search?q=%s&tbm=nws&start=%i" % (query, start)

    #     items = tree.xpath('//a[@class="l _HId"]')
    #     for i in items:
    #         s = i.text_content().replace('\n', '').strip().encode('utf8')
    #         print s
    #         # if s:
    #         #     output.write(s)
    #         #     output.write('\n')

