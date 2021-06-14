import requests
from pprint import pprint
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin

def get_all_forms(url):
    """Dado uma `url`, ele retorna todos os formulários do conteúdo HTML"""
    soup = bs(requests.get(url).content, "html.parser")
    return soup.find_all("form")

def get_form_details(form):
    """
    Esta função extrai todas as informações úteis possíveis sobre um `formulário` HTML
    """
    details = {}
    # obtém o action do formulário (url de destino)
    action = form.attrs.get("action").lower()
    # obtém o método do formulário (POST, GET, etc)
    method = form.attrs.get("method", "get").lower()
    # obtém todos os detalhes do input, como type e name
    inputs = []
    for input_tag in form.find_all("input"):
        input_type = input_tag.attrs.get("type", "text")
        input_name = input_tag.attrs.get("name")
        inputs.append({"type": input_type, "name": input_name})
    # colocamos tudo no dicionário resultante
    details["action"] = action
    details["method"] = method
    details["inputs"] = inputs
    return details

def submit_form(form_details, url, value):
    """
    Envia um formulário fornecido em `form_details`
    Params:
        form_details (list): um dicionário que contém informações do formulário
        url (str): o URL original que contém esse formulário
        value (str): isso será substituído em todas os inputs de texto e pesquisa
    Retorna a resposta HTTP após o envio do formulário
    """
    # construir o URL completo (se o url fornecido em action for relativo)
    target_url = urljoin(url, form_details["action"])
    # obtém os inputs
    inputs = form_details["inputs"]
    data = {}
    for input in inputs:
        # substitui todo o texto e valores de pesquisa por `value`
        if input["type"] == "text" or input["type"] == "search":
            input["value"] = value
        input_name = input.get("name")
        input_value = input.get("value")
        if input_name and input_value:
            # se o name e o value de input não forem None,
            # então, adicione-os aos dados de envio do formulário
            data[input_name] = input_value

    if form_details["method"] == "post":
        return requests.post(target_url, data=data)
    else:
        # GET request
        return requests.get(target_url, params=data)

def scan_xss(url):
    """
    Dado uma `url`, ele imprime todos os formulários XSS vulneráveis e
    retorna True se algum for vulnerável, False caso contrário
    """
    # obtém todos os formulários da URL
    forms = get_all_forms(url)
    print(f"[+] Detected {len(forms)} forms on {url}.")
    js_script = "<Script>alert('XSS Detected')</script>"
    # valor de retorno
    is_vulnerable = False
    # itera sob todos os formulários
    for form in forms:
        form_details = get_form_details(form)
        content = submit_form(form_details, url, js_script).content.decode('latin-1')
        if js_script in content:
            print(f"[+] XSS Detected on {url}")
            print(f"[*] Form details:")
            pprint(form_details)
            is_vulnerable = True
    return is_vulnerable

url = "https://xss-game.appspot.com/level1/frame"
print(scan_xss(url))