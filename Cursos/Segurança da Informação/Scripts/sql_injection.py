import requests
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin
from pprint import pprint

s = requests.Session()
s.headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36"

def get_all_forms(url):
    """Dado uma `url`, ele retorna todos os formulários do conteúdo HTML"""
    soup = bs(s.get(url).content, "html.parser")
    return soup.find_all("form")

def get_form_details(form):
    """
    Esta função extrai todas as informações úteis possíveis sobre um `form` HTML
    """
    details = {}
    # obtém o form action (target url)
    try:
        action = form.attrs.get("action").lower()
    except:
        action = None
    # obtém o método do form (POST, GET, etc)
    method = form.attrs.get("method", "get").lower()
    # obter todos os detalhes do input, como type e name
    inputs = []
    for input_tag in form.find_all("input"):
        input_type = input_tag.attrs.get("type", "text")
        input_name = input_tag.attrs.get("name")
        input_value = input_tag.attrs.get("value", "")
        inputs.append({"type": input_type, "name": input_name, "value": input_value})
    # coloca tudo no dicionário resultante
    details["action"] = action
    details["method"] = method
    details["inputs"] = inputs
    return details

def is_vulnerable(response):
    """Uma função booleana simples que determina se uma página 
    é vulnerável a SQL Injection baseado em sua `resposta`"""
    errors = {
        # MySQL
        "you have an error in your sql syntax;",
        "warning: mysql",
        # SQL Server
        "unclosed quotation mark after the character string",
        # Oracle
        "quoted string not properly terminated",
    }
    for error in errors:
        # se você encontrar um desses erros, retorne True
        if error in response.content.decode().lower():
            return True
    # nenhum erro detectado
    return False

def scan_sql_injection(url):
    # testa na url
    for c in "\"'":
        # adiciona aspas / aspas duplas ao URL
        new_url = f"{url}{c}"
        print("[!] Trying", new_url)
        # faz a requisição HTTP
        res = s.get(new_url)
        if is_vulnerable(res):
            # SQL Injection detectada na própria URL 
            # não há necessidade de preceder para extrair formulários e enviá-los
            print("[+] SQL Injection vulnerability detected, link:", new_url)
            return
    # testa nos formulários HTML
    forms = get_all_forms(url)
    print(f"[+] Detected {len(forms)} forms on {url}.")
    for form in forms:
        form_details = get_form_details(form)
        for c in "\"'":
            # o corpo de dados que queremos enviar
            data = {}
            for input_tag in form_details["inputs"]:
                if input_tag["type"] == "hidden" or input_tag["value"]:
                    # qualquer formulário de input que está oculto ou tem algum valor,
                    # apenas use-o no corpo do formulário
                    try:
                        data[input_tag["name"]] = input_tag["value"] + c
                    except:
                        pass
                elif input_tag["type"] != "submit":
                    data[input_tag["name"]] = f"test{c}"
            # unir a url com o action (form request URL)
            url = urljoin(url, form_details["action"])
            if form_details["method"] == "post":
                res = s.post(url, data=data)
            elif form_details["method"] == "get":
                res = s.get(url, params=data)
            # teste se a página resultante é vulnerável
            if is_vulnerable(res):
                print("[+] SQL Injection vulnerability detected, link:", url)
                print("[+] Form:")
                pprint(form_details)
                break

if __name__ == "__main__":
    url = "http://testphp.vulnweb.com/artists.php?artist=1"
    scan_sql_injection(url)