import platform, socket, re, struct, json, psutil, logging, fcntl
from pprint import pprint

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

def get_mac(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    info = fcntl.ioctl(s.fileno(),0x8927, struct.pack('256s',bytes(ifname,'utf-8')[:15]))
    return ':'.join('%02x' % b for b in info[18:24])

def get_system_info():
    try:
        info = {}
        info['platform'] = platform.system()
        info['platform-release'] = platform.release()
        info['platform-version'] = platform.version()
        info['architecture'] = platform.machine()
        info['processor'] = platform.processor()
        info['physical-cores'] = psutil.cpu_count(logical=False)
        info['total-cores'] = psutil.cpu_count(logical=True)
        info['hostname'] = socket.gethostname()
        info['ip-address'] = get_ip()
        info['mac-address'] = get_mac('wlp3s0')
        info['ram'] = str(round(psutil.virtual_memory().total / (1024.0**3))) + " GB"
        return json.dumps(info)
    except Exception as e:
        logging.exception(e)

pprint(json.loads(get_system_info()))