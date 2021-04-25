class Graph:
	def __init__(self, graph):
		if isinstance(graph, dict):
			self.graph = graph 
		else:
			print("Invalid Data Type")

	def __repr__(self):
		return ''.join(str(self.graph))

	def edges(self, vertice):
		return self.graph[vertice]

	def all_vertices(self):
		return set(self.graph.keys())

	def all_edges(self):
		return self.generate_edges()

	def generate_edges(self):
		edges = []
		for vertex in self.graph:
			for neighbour in self.graph[vertex]:
				if {neighbour, vertex} not in edges:
					edges.append({vertex,neighbour})
		return edges

	def find_isolated_vertices(self):
		isolated = set()
		for vertex in self.graph:
			if not self.graph[vertex]:
				isolated.add(vertex)
		return isolated

	def find_path(self, start_vertex, end_vertex, path=None):
		if path == None:
			path = []
		graph = self.graph 
		path = path + [start_vertex]
		if start_vertex == end_vertex:
			return path 
		if start_vertex not in graph:
			return None 
		for vertex in graph[start_vertex]:
			if vertex not in path:
				extended_path = self.find_path(vertex,end_vertex,path)
				if extended_path:
					return extended_path
		return None

	def find_all_paths(self, start_vertex, end_vertex, path=[]):
		graph = self.graph 
		path = path + [start_vertex]
		if start_vertex == end_vertex:
			return [path]
		if start_vertex not in graph:
			return []
		paths = []
		for vertex in graph[start_vertex]:
			if vertex not in path:
				extended_paths = self.find_all_paths(vertex, end_vertex, path)
				for p in extended_paths:
					paths.append(p)
		return paths

	def vertex_degree(self, vertex):
		degree = len(self.graph[vertex])
		if vertex in self.graph[vertex]:
			degree += 1
		return degree

	def max_degree(self):
		max = 0
		for vertex in self.graph:
			vertex_degree = self.vertex_degree(vertex)
			if vertex_degree > max:
				max = vertex_degree
		return max

	def degree_sequence(self):
		seq = []
		for vertex in self.graph:
			seq.append(self.vertex_degree(vertex))
		seq.sort(reverse=True)
		return seq

# Figura g1: https://i.imgur.com/8B6Tj6K.png
g1 = Graph({"a" : {"c"},
          "b" : {"c", "e"},
          "c" : {"a", "b", "d", "e"},
          "d" : {"c"},
          "e" : {"c", "b"},
          "f" : {}
          })
print('Grafo g1:')
print(g1)
print('Gerando arestas (edges) de g1:')
print(g1.generate_edges())
print('Imprimindo todos os vértices de g1:')
print(g1.all_vertices())
print('Imprimindo todas as arestas do vértice "c":')
print(g1.edges('c'))
print('Imprimindo os vértices isolados de g1:')
print(g1.find_isolated_vertices())
print('Encontrando o caminho do vértice "d" para o vértice "b":')
print(g1.find_path('d','b'))
print('Encontrando o caminho do vértice "a" para o vértice "e":')
print(g1.find_path('a','e'))
print('Encontrando o grau do vértice "f":')
print(g1.vertex_degree('f'))
print('Grau máximo de um vértice do grafo g1:')
print(g1.max_degree())
print('Sequência de graus ordenadas do maior para o menor:')
print(g1.degree_sequence())
print('\n')

# Figura g2: https://i.imgur.com/5Am38Eo.png
g2 = Graph({"a" : {"d", "f"},
      "b" : {"c"},
      "c" : {"b", "c", "d", "e"},
      "d" : {"a", "c", "f"},
      "e" : {"c"},
      "f" : {"a", "d"}
    })
print('Vértices do grafo g2:')
print(g2.all_vertices())
print('Arestas (edges) do grafo g2:')
print(g2.all_edges())
print('Todos os caminhos do vértice "a" para o vértice "b":')
path = g2.find_all_paths("a", "b")
print(path)
print('Todos os caminhos do vértice "a" para o vértice "f":')
path = g2.find_all_paths("a", "f")
print(path)
print('Todos os caminhos do vértice "c" para o vértice "c":')
path = g2.find_all_paths("c", "c")
print(path)