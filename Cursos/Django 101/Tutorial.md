# Django 101

**Django 101** é um mini-curso que visa trazer o conhecimento dos fundamentos básicos do [Django Web Framework](https://www.djangoproject.com/).

Desenvolveremos um blog que permite aos usuários criar, editar e excluir postagens. A página inicial listará todas as postagens do blog e haverá uma página de detalhes dedicada para cada postagem individual.

## Pré-requisitos

Django é um Web Framework escrito na linguagem Python que segue o padrão arquitetônico **model-view-template**.

Sendo assim, o único pré-requisito necessário para este projeto é que você tenha o Python instalado em sua máquina, especificamente a versão 3.

Para obter o Python 3, visite a sua página oficial: **[python.org](https://www.python.org/)**

## Criando e Ativando Ambientes Virtuais

Ao construir projetos Python, é uma boa prática trabalhar em ambientes virtuais para manter o seu projeto e suas dependências isoladas em sua máquina para evitar conflitos de versões.

### Usuários Linux e Mac

Se você está em um ambiente Linux ou Mac, digite os seguintes comandos para iniciar o projeto, criar e ativar o ambiente virtual:

```
mkdir projeto
cd projeto
python3 -m venv env
source env/bin/activate
```

### Usuários Windows

Caso esteja em uma máquina com Windows, crie um diretório para o projeto e digite os seguintes comandos:

```
cd projeto
virtualenv env
cd env
Scripts\activate.bat
```

Agora você deve ver `(env)` prefixado em seu terminal, o que indica que o ambiente virtual foi ativado com sucesso.

## Instalando Django

Para instalar o Django em seu ambiente virtual execute o comando abaixo:

```
pip install Django
```

Isso instalará a versão mais recente do Django em nosso ambiente virtual.

## Configurando o Projeto

Nosso primeiro passo será criar um diretório chamado `website`.

```
mkdir website
```

Uma vez que o diretório foi criado, vamos navegar dentro dele.

```
cd website
```

Agora execute o seguinte comando em seu shell para criar um projeto Django.

```
django-admin startproject website
```

Isso irá gerar uma estrutura de projeto com diretórios e scripts Python, similar a esta:

```
├── manage.py
└── website
    ├── asgi.py
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py

1 directory, 6 files
```

Em seguida, precisamos criar um aplicativo Django chamado blog. Um aplicativo Django existe para realizar uma tarefa específica. Você pode criar aplicativos específicos que são responsáveis por fornecer funcionalidades desejadas ao seu site.

Navegue até o diretório externo onde existe o script `manage.py` e execute o comando abaixo.

```
cd website
python manage.py startapp blog
```

Isso criará um **app** chamado **blog** em nosso projeto, adicionando mais scripts Python e diretórios ao nosso projeto, que ficará com uma estrutura similar a esta:

```
├── blog
│   ├── admin.py
│   ├── apps.py
│   ├── __init__.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── manage.py
└── website
    ├── asgi.py
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py

3 directories, 13 files
```

Agora precisamos informar ao Django que um novo aplicativo foi criado, abra seu arquivo `settings.py` e vá até a seção **INSTALLED_APPS**, que deve ter alguns aplicativos já instalados.

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

Agora adicione o app blog recém-criado na parte inferior e salve-o.

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog'
]
```

Em seguida, devemos fazer migrações para atualizar o nosso banco de dados.

```
python manage.py migrate
```

Isso aplicará todas as migrações não aplicadas no banco de dados **SQLite** que vem junto com a instalação do Django.

Finalmente vamos testar nossas configurações executando o servidor de desenvolvimento integrado do Django.

```
python manage.py runserver
```

Abra seu navegador e visite este endereço `http://127.0.0.1:8000/` se tudo correu bem você deve ver esta página.

![img](/Screenshots/django101.png)

## Modelos de Banco de Dados

Agora vamos definir os modelos de dados para nosso blog. Um modelo é uma classe Python que herda as funcionalidades de `django.db.models.Model`, em que cada atributo representa um campo do banco de dados.

Usando esta funcionalidade de herança, automaticamente temos acesso a tudo dentro de `django.db.models.Models` e podemos adicionar campos e métodos adicionais conforme desejado. Teremos um modelo **Post** em nosso banco de dados para armazenar postagens.

Vamos então editar o arquivo `models.py` e adicionar o seguinte conteúdo:

```python
from django.db import models
from django.contrib.auth.models import User


STATUS = (
    (0,"Draft"),
    (1,"Publish")
)

class Post(models.Model):
    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    author = models.ForeignKey(User, on_delete= models.CASCADE,related_name='blog_posts')
    updated_on = models.DateTimeField(auto_now=True)
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS, default=0)

    class Meta:
        ordering = ['-created_on']

    def __str__(self):
        return self.title
```

No topo, estamos importando a classe `models`, em seguida, criamos uma subclasse de `models.Model`. Como qualquer blog tradicional, cada postagem de blog terá um **título**, **slug**, **nome do autor** e a **data**/**hora** em que o artigo foi publicado ou atualizado pela última vez.

Observe como declaramos uma tupla para **STATUS** de uma postagem para manter as postagens de **rascunho** e **publicadas** separadas quando os renderizamos com **templates**.

A classe Meta dentro do modelo contém metadados. Dizemos ao Django para ordenar os resultados no campo `created_on` em ordem decrescente por padrão quando consultamos o banco de dados. Especificamos a ordem decrescente usando o prefixo negativo, ao fazer isso, as postagens publicadas recentemente aparecerão primeiro.

O método `__str__()` é a representação padrão legível por humanos do objeto. Django o usará em muitos lugares, como por exemplo no site de administração.

Agora que nosso novo modelo de banco de dados foi criado, precisamos criar um novo registro de migração para ele e migrar a mudança para nosso banco de dados.

Devemos então executar os dois seguintes comandos em nosso terminal:

```
$ python manage.py makemigrations 
$ python manage.py migrate
```

Agora nosso banco de dados está pronto.

## Criando um Site de Administração

Vamos criar um painel de administração para criar e gerenciar Postagens. Felizmente, o Django vem com uma interface de administração embutida para tais tarefas.

Para usar o **Django admin**, primeiro precisamos criar um **superusuário** executando o seguinte comando no terminal.

```
python manage.py createsuperuser
```

Você será solicitado a inserir **e-mail**, **senha** e **nome de usuário**. Observe que, por questões de segurança, a senha não ficará visível.

Insira quaisquer credenciais que desejar, você sempre pode alterá-las mais tarde. Depois disso, execute novamente o servidor de desenvolvimento e vá para o endereço `http://127.0.0.1:8000/admin/`.

```
python manage.py runserver
```

Você deve ver uma página de login, insira as credenciais que você forneceu no cadastro do **superusuário**.

![img](/Screenshots/logindjango.png)

Depois de fazer o login, você deve ver um painel de administração básico com modelos de grupos (**Groups**) e usuários (**Users**) que vêm do framework de autenticação Django localizado em `django.contrib.auth`.

![img](/Screenshots/siteadmin.png)

Ainda assim, não podemos criar postagens a partir do painel, precisamos adicionar o modelo **Post** ao nosso painel de administrador.

## Adicionando Modelos ao Painel de Administração

Abra o arquivo `blog/admin.py` e registre o modelo **Post** adicionando o seguinte código:

```python 
from django.contrib import admin
from .models import Post 

admin.site.register(Post)
```

Salve o arquivo e atualize a página para ver o modelo **Posts** disponível no painel de administração.

![img](/Screenshots/adminposts.png)

Agora vamos criar nossa primeira postagem no blog, clique no ícone **Add** ao lado de **Posts** que o levará a outra página onde você poderá criar uma postagem. Preencha os respectivos formulários e crie sua primeira postagem.

![img](/Screenshots/post.png)

Quando terminar de salvar a postagem você será redirecionado para a página da lista de postagens com uma mensagem de sucesso no topo.

![img](/Screenshots/postsucess.png)

Podemos também personalizar a forma como os dados são exibidos no painel de administração de acordo com nossa conveniência. Abra novamente o arquivo `admin.py` e substitua seu conteúdo pelo código abaixo.

```python
from django.contrib import admin
from .models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status','created_on')
    list_filter = ("status",)
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
  
admin.site.register(Post, PostAdmin)
```

Isso tornará nosso painel de administração mais eficiente. Agora, se você visitar a lista de postagens, verá mais detalhes sobre o **Post**.

![img](/Screenshots/postupgrade.png)

Observe que adicionei alguns posts para teste.

O atributo **list_display** faz o que seu nome sugere, ao exibir as propriedades mencionadas na tupla na lista de postagens para cada postagem:

- Coluna **TITLE**
- Coluna **SLUG**
- Coluna **STATUS**
- Coluna **CREATED ON**

Se você notar à direita, há um filtro que está filtrando a postagem dependendo de seu Status, isso é feito pelo método **list_filter**.

E agora temos uma barra de pesquisa no topo da lista, que pesquisará o banco de dados a partir dos atributos **search_fields**. O último atributo **prepopulated_fields** preenche o **slug**, agora se você criar uma postagem, o slug será preenchido automaticamente com base no seu título.

Agora que nosso modelo de banco de dados está completo, precisamos criar as **views**, **URLs** e **templates** necessários para que possamos exibir as informações em nossa aplicação web.

## Construindo Views

Uma Django **view** é apenas uma função Python que recebe uma **requisição** web e retorna uma **resposta**. Vamos usar views baseadas em classe, em seguida, mapear URLs para cada view e criar um modelo HTML para os dados retornados das views.

Vamos então editar o arquivo `blog/views.py` com o seguinte conteúdo:

```python
from django.views import generic
from .models import Post

class PostList(generic.ListView):
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    template_name = 'index.html'

class PostDetail(generic.DetailView):
    model = Post
    template_name = 'post_detail.html'
```

O **ListView** integrado, que é uma subclasse de views genéricas baseadas em classes, que renderiza uma lista com os objetos do modelo especificado, só precisamos mencionar o modelo, da mesma forma que **DetailView** fornece uma view detalhada para um determinado objeto do modelo no **template** fornecido.

Observe que, para a view **PostList**, aplicamos um filtro para que apenas a postagem com o STATUS de publicada seja exibida no front-end de nosso blog. Também na mesma consulta, organizamos todas as postagens por sua data de criação. O sinal (`-`) antes de **created_on** significa que a última postagem estará no topo e assim por diante.

## Adicionando Padrões de URL para as Views

Precisamos mapear a URL para as views que fizemos acima. Quando um usuário faz uma requisição de uma página em sua aplicação web, o controlador Django assume comando para procurar a view correspondente por meio do arquivo `urls.py` e, em seguida, retorna a resposta HTML ou um erro 404 não encontrado, se não for encontrado.

Crie um novo arquivo `urls.py` no diretório do aplicativo blog e adicione o código a seguir.

```python
from . import views
from django.urls import path

urlpatterns = [
    path('', views.PostList.as_view(), name='home'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
]
```

Mapeamos padrões gerais de URL para nossas views usando a função **path**. O primeiro padrão recebe uma string vazia denotada por `''` e retorna o resultado gerado a partir da view **PostList** que é essencialmente uma lista de postagens para nossa página inicial e, por fim, temos um nome de parâmetro opcional que é basicamente um nome para a view que será posteriormente ser usado nos templates.

Os **names** são um parâmetro opcional, mas é uma boa prática dar nomes únicos e memoráveis às views, o que facilita nosso trabalho ao projetar templates e ajuda a manter as coisas organizadas conforme o número de URLs aumenta.

Em seguida, temos a expressão generalizada para as views **PostDetail** que resolvem o **slug** (uma string consistindo de letras ou números ASCII). Django usa colchetes angulares `<>` para capturar os valores da URL e retornar a página de detalhes do post equivalente.

Agora precisamos incluir esses URLs de blog no projeto principal para fazer isso, abra o arquivo `website/urls.py`.

Ele estará com o seguinte conteúdo:

```python
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

Devemos alterá-lo para incluir as novas URLs. Agora, primeiro importe a função **include** e, em seguida, adicione o **path** (caminho) para o novo arquivo `urls.py` na lista de padrões de URL.

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('blog.urls')),
]
```

Agora, todas as requisições serão tratadas diretamente pelo blog app.

## Criando Templates para as Views

Concluímos os **modelos** e as **views**, agora precisamos fazer templates para renderizar o resultado aos nossos usuários. Para usar templates Django, precisamos definir a configuração do template primeiro.

Primeiramente, crie um diretório de nome `templates` dentro do diretório `blog`.

Agora abra o arquivo `settings.py` do projeto e, logo abaixo da constante `BASE_DIR`, adicione a rota ao diretório do template da seguinte forma.

```python
TEMPLATES_BLOG = os.path.join(BASE_DIR,'blog/templates')
```

Agora, em `settings.py`, vá até **TEMPLATES**, que deve ter uma estrutura similar a esta.

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Agora adicione o recém-criado `TEMPLATES_BLOG` em `DIRS`, que ficará da seguinte forma

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATES_BLOG],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

Agora salve e feche o arquivo, as configurações estão concluídas.

Django torna possível separar python e HTML, o python vai em views e HTML vai em templates. Django possui uma linguagem de template poderosa que permite a você especificar como os dados são exibidos. É baseado em **tags** de template, **variáveis** de template e **filtros** de template.

Começaremos com um arquivo `base.html` e um arquivo `index.html` que herda dele. Mais tarde, quando adicionarmos templates para a página inicial e as páginas de detalhes da postagem, eles também podem herdar de `base.html`, que nos serve então como estrutura base onde injetamentos nosso conteúdo.

Vamos então criar o arquivo `base.html` dentro do diretório **templates** que criamos recentemente, que terá elementos comuns para o blog em qualquer página, como a barra de navegação e o footer (rodapé).

```html
<html>
    <head>
        <title>Django 101</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </head>
    <body>
        <!-- Navigation -->
        <nav>
            <a href="{% url 'home' %}">Django 101</a>
        </nav>
        <!-- Content -->
        {% block content %}
        {% endblock content %}
        <!-- Footer -->
        <footer>
            <p>Copyright &copy; Django 101</p>
        </footer>
    </body>
</html>
```

Este é um arquivo HTML normal, exceto pelas tags entre chaves `{}` que são chamadas de **template tags**.

O `{% url 'home'%}` retorna uma referência de caminho absoluto, ele gera um link para a home view que também é a view de lista para as postagens.

O `{% block content%}` define um bloco que pode ser sobrescrito por templates filhos, é aqui que o conteúdo do outro arquivo HTML será injetado.

Vamos agora criar o arquivo `index.html` do nosso blog que é a nossa página inicial.

```html
{% extends "base.html" %} 

{% block content %}
<!-- Blog Header -->
<header>
    <h3>Web Blog</h3>
    <p>Powered by Django Web Framework</p>
</header>
<!-- Blog Posts -->
<div>
    {% for post in post_list %}
    <div class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.author }} | {{ post.created_on}} </p>
        <p class="post-excerpt">{{ post.content|slice:":200" }}...</p>
        <a href="{% url 'post_detail' post.slug  %}">Read More &rarr;</a>
    </div>
    {% endfor %}
</div>
{% endblock content %}
```

Com a tag de template `{% extends%}`, dizemos ao Django para herdar do template `base.html`. Então, estamos preenchendo os blocos de conteúdo do template **base** com conteúdo.

Observe que estamos usando o **for loop** em HTML, que é o poder dos templates Django que torna o HTML dinâmico. O loop está iterando pelas postagens e exibindo seu **título**, **data**, **autor** e **conteúdo**, incluindo um link no **slug** para a URL canônica da postagem.

No conteúdo da postagem, também estamos usando filtros de template para limitar as palavras nos trechos a 200 caracteres. Os filtros de template permitem que você modifique variáveis para exibição e são semelhantes a sintaxe `{{variável | filtro}}`.

Agora execute o servidor e visite `http://127.0.0.1:8000/` você verá a página inicial do nosso blog.

![img](/Screenshots/index.png)

Perceba que adicionei alguns posts apenas de exemplo para visualizarmos a estrutura de nossa página inicial.

Observe que os links para os detalhes de nossos posts não está funcionando, Django nos retorna um erro.

Para resolver este problema, vamos fazer um template HTML para a visão detalhada de nossas postagens.

Crie um arquivo `post_detail.html` dentro de **templates** e cole o HTML abaixo nele.

```html
{% extends 'base.html' %} 

{% block content %}
<h1 class="title">{{ post.title }}</h1>
<p class="author">{{ post.author }} | {{ post.created_on }}</p>
<div class="post-content">
    <p>{{ post.content | safe | linebreaks }}</p>
</div>
{% endblock content %}
```

Na parte superior, especificamos que este template herda de `base.html`, em seguida, exibimos o corpo de nosso objeto de contexto, que **DetailView** torna acessível como um objeto.

Perceba que estamos filtrando o conteúdo de nosso post como seguro (**safe**) e também para ele aceitar quebra de linha (**linebreaks**).

Agora visite a página inicial e clique em **Read More**, isso deve redirecioná-lo para a página de detalhes do post.

![img](/Screenshots/detail.png)

## Adicionando Estilos (CSS)

Para dar o toque final em nossa aplicação web, vamos adicionar estilos a ela, para que ela fique mais apresentável, sinta-se livre para customizar da forma que desejar.

Abra novamente o seu arquivo `base.html` e logo embaixo da tag `<head>` adicione o seguinte conteúdo:

```html
    <style type="text/css">
        body {
            background-color: #1b1c1f;
            color: #d9d9d9;
        }
        nav, footer, header {
            margin-left: 15px;
        }
        nav > a {
            font-size: 1.9rem;
            color: white;
            text-decoration: none;
        }
        .post {
            background-color: #103E2E;
            margin: 15px;
            padding: 0px 20px 30px 20px;
            border: 3.5px solid black;
        }
        .post > a {
            color: white;
            padding: 10px;
            border: 1.7px solid #d9d9d9;
            background-color: black;
            text-decoration: none;
        }
        .post-excerpt {
            text-align: justify;
            padding: 0px 6px 6px 0px;
            font-size: 1.11rem;
        }
        .post-content {
            text-align: justify;
            margin: 0px 15px 0px 15px;
            background-color: #103E2E;
            font-size: 1.12rem;
            padding: 10px 20px 10px 20px;
            border: 3.5px solid black;
        }
        .title, .author {
            margin-left: 15px;
        }
    </style>
```

Nosso resultado final será:

![img](/Screenshots/blogfinal.png)

## Referências

- [Django Web Framework](https://www.djangoproject.com/)
- [Django Tutorial: MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django)
- [Django Central](https://djangocentral.com/)