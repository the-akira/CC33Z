import requests
  
def domain_scanner(domain_name,sub_domnames):
    print('\nScanner Inicializado\n')
    print('Subdomínios encontrados:')

    for subdomain in sub_domnames:
        url = f"https://{subdomain}.{domain_name}"
          
        try:
            requests.get(url)
            print(f'[+] {url}')
              
        except requests.ConnectionError:
            pass
    print('Scanner Finalizado')
  
if __name__ == '__main__':
    dom_name = input("Informe o nome do domínio: ")

    with open('subdomains.txt','r') as file:
        name = file.read()
        sub_dom = name.splitlines()
    domain_scanner(dom_name,sub_dom)