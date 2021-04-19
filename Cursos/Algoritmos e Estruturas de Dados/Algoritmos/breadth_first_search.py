import collections

def bfs(graph, root):
    visited, queue = set(), collections.deque([root])
    visited.add(root)

    while queue:
        vertex = queue.popleft()
        print(str(vertex) + " ", end="")

        for neighbour in graph[vertex]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)

graph = {0:[1, 2, 3], 1:[0, 2], 2:[0 ,1, 4], 3:[0], 4:[2]}
print("Breadth First Traversal:")
bfs(graph, 0)