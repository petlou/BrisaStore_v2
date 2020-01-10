# BRISA STORE

Segue instruções para inicializar o projeto

## Configurações iniciais

Recomendado o uso dos seguintes softwares:

```
Visual Studio Code
Yarn
Docker
PostBird
Insomnia
```

### Primeira inicialização

Baixar o projeto:

```
git clone https://github.com/petlou/BrisaStore_v2.git
```

Baixar as dependências do projeto com o seguinte comando:

```
yarn
```

Criar o container no Docker para acesso ao banco de dados:

```
docker run --name BrisaStore -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:11
```

Realizar a conexão do banco via Postbird e criar a database "BrisaStore".

Na pasta do projeto realizar os seguintes comandos para subir o banco de dados:

```
yarn sequelize db:migrate
yarn sequelize db:seed:all
```
Inicializar o projeto com o seguinte comando:

```
yarn start
```