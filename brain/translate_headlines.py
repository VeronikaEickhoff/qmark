import requests
import json
from pprint import pprint
import urllib
from time import sleep


def translate(sourceLang, targetLang, sourceText):
    try:
        encoded = urllib.quote_plus(sourceText.encode('utf8'))
    except:
        return None
    url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=%s&tl=%s&dt=t&q=%s" % (sourceLang, targetLang, encoded)
    response = requests.get(url)
    if(response.ok):
        jData = json.loads(response.content)
        return jData[0][0][0]
    else:
        response.raise_for_status()

def translate2(sourceLang, targetLang, sourceText):
    # print sourceText
    sleep(0.1)
    translated = translate(sourceLang, targetLang, sourceText)
    # print translated
    sleep(0.1)
    translated = translate(targetLang, sourceLang, translated)
    # print translated
    return translated

text = 'Kosheh massacres21 Coptic Christians were the victims of a massacre in el-Kosheh village in Upper Egypt, located 450 kilometres south of Cairo.'
text = 'Boo.com collapses due to lack of funds after six months.'
translate2('en', 'fi', text)

with open('translated_headlines.txt', 'w') as o:
    def p(s):
        try:
            print s
            if s:
                o.write(s.encode('utf8'))
                o.write('\n')
        except:
            return

    with open('short_headlines.txt', 'r') as i:
        for line in i.readlines():
            text = line.strip()
            p(text)
            translated = translate('fi', 'en', translate('eo', 'fi', translate2('en', 'eo', text)))
            p(translated)
            # translated = translate2('en', 'fi', text)
            # p(translated)
            # translated = translate2('en', 'fr', text)
            # p(translated)





