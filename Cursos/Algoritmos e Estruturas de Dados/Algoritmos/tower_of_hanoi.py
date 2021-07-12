def move_tower(height,start,middle,goal):
    if height >= 1:
        move_tower(height-1,start,goal,middle)
        move_disk(height,start,goal)
        move_tower(height-1,middle,start,goal)

def move_disk(n,sp,gp):
    print(f"Movendo disco {n} em {sp} para {gp}")

discos = 3
move_tower(discos,"A","B","C")