import requests
import os
from tqdm import tqdm
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin, urlparse

def is_valid(url):
    """
    Checa se a `url` é uma URL válida.
    """
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def get_all_images(url):
    """
    Retorna todas as URL's de imagem em uma única `url`
    """
    soup = bs(requests.get(url).content, "html.parser")
    urls = []
    for img in tqdm(soup.find_all("img"), "Extracting images"):
        img_url = img.attrs.get("src")
        if not img_url:
            # se a imagem não tiver o atributo src, pular
            continue
        # torna a URL absoluta ao unir o domínio com a URL da imagem que foi extraída
        img_url = urljoin(url, img_url)
        try:
            pos = img_url.index("?")
            img_url = img_url[:pos]
        except ValueError:
            pass
        # finalmente, se a url for válida
        if is_valid(img_url):
            urls.append(img_url)
    return urls

def download(url, pathname):
    """
    Faz o download de um arquivo dado uma URL e coloca o arquivo no folder em `pathname`
    """
    # se o path não existir, faça ele no caminho especificado
    if not os.path.isdir(pathname):
        os.makedirs(pathname)
    # faz o download do body da response por pedaços
    response = requests.get(url, stream=True)
    # obtém o tamanho total do arquivo
    file_size = int(response.headers.get("Content-Length", 0))
    # obtém o nome do arquivo
    filename = os.path.join(pathname, url.split("/")[-1])
    # barra de progresso, alterando a unidade para bytes em vez de iteração (padrão de tqdm)
    progress = tqdm(response.iter_content(1024), f"Downloading {filename}", total=file_size, unit="B", unit_scale=True, unit_divisor=1024)
    with open(filename, "wb") as f:
        for data in progress.iterable:
            # escreve os dados no arquivo
            f.write(data)
            # atualiza a barra de progresso manualmente
            progress.update(len(data))

def main(url, path):
    # obtém todas as imagens
    imgs = get_all_images(url)
    for img in imgs:
        # para cada imagem, faça o download dela
        download(img, path)

main("https://cyberunderground.netlify.app/", "artes")