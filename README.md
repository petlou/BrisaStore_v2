# BRISA STORE

Segue instruções para inicializar o projeto

## Configurações iniciais

Recomendado o uso dos seguintes softwares:

```
Visual Studio Code
Yarn
Docker
PostBird
Mongo Compass
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

Criar o container no Docker para acesso aos banco de dados Postgres e MongoDB:

```
docker run --name BrisaStore -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11
docker run --name mongoBrisa -p 27017:27017 -d -t mongo
docker run --name redisBrisa -p 6379:6379 -d -t redis:alpine
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

### Inicializações Posteriores

Verificar se o Docker está rodando o banco de dados.

```
docker ps
```

Caso não rodar o seguinte comando:

```
docker start BrisaStore
docker start mongoBrisa
```

O projeto já está pronto para ser executado com o comando:

```
yarn start
```

### Para subir o banco de dados

Utilizar os seguintes comandos:

```
yarn sequelize db:migrate
yarn sequelize db:seed:all
```

Para resetar o banco de dados utilizar o seguinte comando:

```
yarn sequelize db:migrate:undo:all
```

Após, utilizar novamente os comandos para subir o banco. "Essa prática não é recomendada".