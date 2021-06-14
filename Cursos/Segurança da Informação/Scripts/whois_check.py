from ipwhois import IPWhois
from pprint import pprint 
import socket

addr = 'example.com'
ip = socket.gethostbyname(addr)
result = IPWhois(ip)
pprint(result.lookup_whois())