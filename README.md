> # Documentação - front-rx-multimarcas
> 
> ## Descrição
> O **front-rx-multimarcas** é uma aplicação de gerenciamento de clientes desenvolvida para o sistema de vendas de uma loja multimarca. Ele oferece uma interface simples e eficiente para cadastro e consulta de clientes, com integração ao backend para persistência e autenticação de dados.
> BackEnd da aplicação: https://github.com/caduce3/api-rx-multimarcas
> 
> ---
> 
> ## Descrição do Projeto
> Esta documentação se refere ao frontend da aplicação **front-rx-multimarcas**, desenvolvida com **React**, **Vite**, **Tailwind CSS**, **ShadCN UI** e outras bibliotecas auxiliares. A aplicação utiliza **React Query** para gerenciamento de estados e **Axios** para comunicação com a API backend.
> 
> ---
> 
> ## Requisitos do Ambiente
> 
> - **Node.js**: >= 18
> - **Gerenciador de pacotes**: npm ou yarn
> - **Vite**: Ferramenta para build de frontend rápido.
> 
> ---
> 
> ## Scripts Disponíveis
> 
> - `npm run dev`: Inicia o servidor de desenvolvimento com **Vite**.
> - `npm run build`: Compila o código TypeScript e cria os arquivos de build.
> - `npm run lint`: Executa a verificação de linting no código com **ESLint**.
> - `npm run preview`: Inicia o servidor para visualizar a build de produção localmente.
> 
> ---
> 
> ## Dependências Principais
> 
> - **React**: Biblioteca para construção da interface do usuário.
> - **Vite**: Ferramenta de build para aplicações frontend.
> - **Tailwind CSS**: Framework de CSS utilitário para estilização.
> - **ShadCN UI**: Biblioteca de componentes de interface de usuário com design intuitivo e altamente personalizável.
> - **Axios**: Cliente HTTP para requisições à API backend.
> - **React Query**: Biblioteca para gerenciamento de estados e cache de dados.
> - **React Router DOM**: Gerenciamento de rotas no React.
> - **Zod**: Biblioteca de validação de dados.
> - **Lucide React**: Ícones para a interface.
> - **Sonner**: Biblioteca para exibição de notificações.
> - **React Hook Form**: Biblioteca para gerenciamento de formulários de forma eficiente.
> 
> ---
> 
> ### Instalação e execução
> 
> 1. Clone o repositório:
> 
> ```bash
> git clone <url-do-repositorio>
> cd front-rx-multimarcas
> ```
> 
> 2. Instale as dependências:
> 
> ```bash
> npm install
> ```
> 
> 3. Execute o servidor em modo de desenvolvimento:
> 
> ```bash
> npm run dev
> ```
> 
> ---
> 
> ### Configuração do Ambiente
> 
> Crie um arquivo `.env` com base no `.env.example` fornecido no repositório:
> 
> ```env
> VITE_API_URL="http://localhost:3333"
> VITE_ENABLE_API_DELAY="true"
> ```
> 
> - **VITE_API_URL**: URL da API backend.
> - **VITE_ENABLE_API_DELAY**: Configura se o atraso da API deve ser habilitado para fins de desenvolvimento.
> 
> ---
> 
> ## Funcionalidades
> 
> - **Autenticação**: A aplicação permite o login de usuários, gerando e armazenando tokens JWT para autenticação nas requisições subsequentes.
> - **Interação com API**: Realiza requisições para a API backend utilizando **Axios**, com o suporte do **React Query** para cache e gerenciamento de estados assíncronos.
> - **Formulários**: Utiliza **React Hook Form** para manipulação eficiente de formulários, com validações feitas com **Zod**.
> - **Interfaces com ShadCN UI**: A interface da aplicação é construída utilizando os componentes oferecidos pelo **ShadCN UI**, proporcionando um design moderno e consistente.
> 
> ---
> 
> ---
> 
> ## Dependências de Desenvolvimento
> 
> As dependências de desenvolvimento incluem ferramentas como **TypeScript**, **ESLint**, e **Prettier** para garantir a qualidade e padronização do código:
> 
> - **TypeScript**: Para tipagem estática e segurança no desenvolvimento.
> - **ESLint**: Ferramenta para análise estática do código e detecção de erros.
> - **Prettier**: Formatação automática do código.
> - **Vite Plugin React**: Suporte para desenvolvimento com React no Vite.
> 
> ---
> 
> ## Exemplos de Uso
> 
> - **Cadastro de Funcionário**: Realiza o cadastro de funcionários através da API, retornando os dados do funcionário cadastrado.
> 
> Exemplo de requisição utilizando **Axios**:
> 
> ```ts
> import { api } from "@/lib/axios";
> 
> export interface RegisterFuncionarioBody {
>     nome: string;
>     email: string;
>     senha: string;
>     cpf: string;
>     telefone: string;
> }
> 
> export async function registerFuncionario({ nome, email, senha, cpf, telefone }: RegisterFuncionarioBody) {
>     try {
>         const response = await api.post('/funcionario', { nome, email, senha, cpf, telefone });
>         return response.data;
>     } catch (error: any) {
>         // console.error('Error registering user:', error);
>         if (error.response) {
>             throw new Error(error.response.data?.message || 'Erro ao cadastrar colaborador.');
>         } else {
>             throw new Error('Erro ao conectar com o servidor');
>         }
>     }
> }
> ```
