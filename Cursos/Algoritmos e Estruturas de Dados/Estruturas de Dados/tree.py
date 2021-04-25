from anytree import Node, RenderTree
from anytree.exporter import DotExporter

x = Node("X")
y = Node("Y", parent=x)
z = Node("Z", parent=y)
k = Node("K", parent=x)
v = Node("V", parent=k)
t = Node("T", parent=k)
m = Node("M", parent=k)

print(x)
print(m)

for pre, fill, node in RenderTree(x):
    print("{}{}".format(pre,node.name))

DotExporter(x).to_picture("tree.png")
# https://i.imgur.com/RAF6aKH.png