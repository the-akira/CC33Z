from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import requests
import colorama

colorama.init()
GREEN = colorama.Fore.GREEN
GRAY = colorama.Fore.LIGHTBLACK_EX
RESET = colorama.Fore.RESET
YELLOW = colorama.Fore.YELLOW

# inicializa o conjunto de links (links únicos)
internal_urls = set()
external_urls = set()
total_urls_visited = 0

def is_valid(url):
    """
    Checa se `url` é uma url válida
    """
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def get_all_website_links(url):
    """
    Retorna todas as URL's que foram encontradas em `url`
    ao qual pertencem ao mesmo website
    """
    urls = set()
    domain_name = urlparse(url).netloc
    soup = BeautifulSoup(requests.get(url).content, "html.parser")

    for a_tag in soup.findAll("a"):
        href = a_tag.attrs.get("href")
        if href == "" or href is None:
            continue

        href = urljoin(url, href)
        parsed_href = urlparse(href)
        href = parsed_href.scheme + "://" + parsed_href.netloc + parsed_href.path

        if not is_valid(href):
            continue
        if href in internal_urls:
            continue
        if domain_name not in href:
            if href not in external_urls:
                print(f"{GRAY}[!] External link: {href}{RESET}")
                external_urls.add(href)
            continue
        print(f"{GREEN}[*] Internal link: {href}{RESET}")
        urls.add(href)
        internal_urls.add(href)
    return urls

def crawl(url, max_urls=30):
    """
    Navega por uma página web e extrai todos os links
    Você encontrará todos os links nas variáveis `external_urls` e `internal_urls`
    params:
    	max_urls (int): número máximo de urls para rastrear, o padrão é 30.
    """
    global total_urls_visited
    total_urls_visited += 1
    print(f"{YELLOW}[*] Crawling: {url}{RESET}")
    links = get_all_website_links(url)
    for link in links:
        if total_urls_visited > max_urls:
            break
        crawl(link, max_urls=max_urls)

max_urls = 60
url = 'https://akiradev.netlify.app'
crawl(url, max_urls)

print("[+] Total Internal links:", len(internal_urls))
print("[+] Total External links:", len(external_urls))
print("[+] Total URLs:", len(external_urls) + len(internal_urls))
print("[+] Total crawled URLs:", max_urls)

domain_name = urlparse(url).netloc

# salvar os links internos em um arquivo
with open(f"links/{domain_name}_internal_links.txt", "w") as f:
    for internal_link in internal_urls:
        print(internal_link.strip(), file=f)

# salvar os links externos em um arquivo
with open(f"links/{domain_name}_external_links.txt", "w") as f:
    for external_link in external_urls:
        print(external_link.strip(), file=f)