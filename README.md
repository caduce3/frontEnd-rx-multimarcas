> # Documentação API - **api-rx-multimarcas**
> 
> ## Descrição
> Esta é a documentação básica da API **api-rx-multimarcas**, desenvolvida para gerenciar vendas e controle de estoque de uma loja de roupas. A API foi construída utilizando **Fastify**, **Prisma ORM** e outras bibliotecas auxiliares. O backend oferece endpoints para gerenciar funcionários, vendas, e o estoque de produtos. 
> 
> **Frontend da aplicação**: [https://github.com/caduce3/frontEnd-rx-multimarcas](https://github.com/caduce3/frontEnd-rx-multimarcas)
> 
> ---
> 
> ## Requisitos do Ambiente
> 
> - **Node.js**: >= 18
> - **Gerenciador de pacotes**: npm ou yarn
> 
> ---
> 
> ## Scripts Disponíveis
> 
> - `npm run dev`: Inicia o servidor em modo de desenvolvimento com **Hot Reload**.
> - `npm run build`: Compila o código TypeScript para JavaScript na pasta build.
> - `npm start`: Inicia o servidor utilizando o código compilado.
> 
> ---
> 
> ## Dependências Principais
> 
> - **Fastify**: Framework web rápido e focado em performance.
> - **Prisma ORM**: ORM para gerenciar o banco de dados.
> - **bcryptjs**: Para hash de senhas.
> - **pg**: Driver PostgreSQL.
> - **zod**: Validação de dados.
> 
> ---
> 
> ### Instalação e Execução
> 
> 1. Clone o repositório:
> 
> ```bash
> git clone <url-do-repositorio>
> cd api-rx-multimarcas
> ```
> 
> 2. Instale as dependências:
> 
> ```bash
> npm install
> ```
> 
> 3. Configure o banco de dados:
> 
> ```bash
> npx prisma migrate dev
> ```
> 
> 4. Execute o servidor em modo de desenvolvimento:
> 
> ```bash
> npm run dev
> ```
> 
> ---
> 
> ### Pontos Importantes
> 
> 1. Crie um `.env` igual ao `.env.example`:
> 
> ```env
> NODE_ENV=dev
> DATABASE_CLIENT=pg
> DATABASE_URL="postgresql://postgres:(SENHA)@localhost:(N°_DA_PORTA)/(NOME_DO_BANCO_DE_DADOS)?schema=public"
> NODE_VERSION=20.15.0
> JWT_SECRET="SUA_CHAVE_JWT_SECRETE"
> URL_TESTE_FRONT="http://localhost:(n° porta)"
> ```
> 
> ---
> 
> ## Endpoints
> 
> ### 1° Cadastrar Funcionário
> 
> - **POST** `/funcionario`
> - **Descrição**: Endpoint para cadastrar um novo funcionário. O status do funcionário será registrado como **INATIVO** inicialmente, e para que o acesso seja liberado, é necessário acessar o banco de dados e ativar manualmente o funcionário.
> - **Body**:
> 
> ```json
> {
>   "nome": "string",
>   "email": "string",
>   "senha": "string",
>   "cpf": "string",
>   "telefone": "string"
> }
> ```
> 
> - **Resposta de Sucesso (200)**:
> 
> ```json
> {
>   "message": "Funcionário cadastrado com sucesso! Para ativar o acesso, acesse o banco de dados e altere o status para ATIVO."
> }
> ```
> 
> - **Descrição da Resposta**: Caso o cadastro do funcionário seja bem-sucedido, será retornada a mensagem de sucesso junto com a instrução para ativar o acesso do funcionário, acessando diretamente o banco de dados e alterando seu status para **ATIVO**. Durante o desenvolvimento, o status do funcionário será configurado como **INATIVO** por padrão.
> 
> ---
> 
> ### 2° Autenticação
> 
> - **POST** `/sessions`
> - **Descrição**: Endpoint para autenticação, que gera um token JWT.
> - **Body**:
> 
> ```json
> {
>   "email": "string",
>   "senha": "string"
> }
> ```
> 
> - **Resposta de Sucesso (200)**:
> 
> ```json
> {
>   "token": "jwt_token_aqui"
> }
> ```
> 
> - **Descrição da Resposta**: Caso o email e a senha estejam corretos, o servidor retornará um token JWT que pode ser utilizado para autenticação nas demais rotas da API.
> 
> ---
> 
> ## Notas Adicionais
> 
> - A API é projetada para gerenciar um sistema de vendas de roupas, com endpoints para cadastrar funcionários, gerenciar produtos no estoque, e realizar o controle de vendas. O uso do **Prisma ORM** permite uma integração eficiente com o banco de dados, e as rotas da API são protegidas por autenticação JWT, garantindo segurança nas operações.
