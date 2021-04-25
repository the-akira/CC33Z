import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
G.add_node('a')
G.add_node('d')
G.add_nodes_from(['b','c'])
G.add_edge('a','c')
G.add_edge('b','c')
G.add_edges_from([('d','c'), ('d','a'),('d','b')])
print(G.nodes)
print(G.edges)
print(G.degree(['d']))
print(G.degree(['b']))

nx.draw(G, with_labels=True, font_weight='bold')
plt.show()