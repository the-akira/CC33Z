import scapy.all as scapy 

# Instalar a lib scapy:
# apt-get install python-scapy

request = scapy.ARP()
request.pdst = '192.168.0.1/24'
broadcast = scapy.Ether()
broadcast.dst = 'ff:ff:ff:ff:ff:ff'

request_broadcast = broadcast / request 
clients = scapy.srp(request_broadcast, timeout=10, verbose=2)[0] 

for element in clients: 
    print('IP = {} | MAC = {}'.format(element[1].psrc,element[1].hwsrc))