from bs4 import BeautifulSoup
import urllib.request

parser = 'html.parser' 
resp = urllib.request.urlopen("https://cc33z.netlify.app/")
soup = BeautifulSoup(resp, parser, from_encoding=resp.info().get_param('charset'))

for link in soup.find_all('a', href=True):
    print(link['href'])