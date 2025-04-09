# Real-Flux - Sistema de Gerenciamento de Transações Financeiras

![Real-Flux Logo](https://via.placeholder.com/150x50?text=Real-Flux) *(adicione seu logo depois)*

O Real-Flux é uma aplicação web para gerenciamento de transações financeiras pessoais com suporte a múltiplas moedas e cotações em tempo real.

## Tecnologias Utilizadas

- **Frontend**: Next.js (React)
- **Backend**: Ruby on Rails/Sinatra *(escolha o framework Ruby que está usando)*
- **Banco de Dados**: MySQL
- **Infraestrutura**: Docker

## Estrutura do Projeto
real-flux/
├── docker-compose.yaml
├── .env
├── .gitignore
├── frontend/ # Aplicação Next.js
│ ├── public/
│ ├── src/
│ ├── pages/ # Rotas da aplicação
│ │ ├── index.js # Página inicial
│ │ ├── auth/ # Autenticação
│ │ ├── dashboard/ # Painel principal
│ │ ├── transactions/ # Gestão de transações
│ │ └── settings/ # Configurações
│ └── ...
├── backend/ # Aplicação Ruby
│ ├── app/
│ ├── config/
│ ├── db/
│ └── ...
└── README.md


## Páginas Principais

1. **Autenticação**
   - Login
   - Registro
   - Recuperação de senha

2. **Dashboard**
   - Visão geral das finanças
   - Gráficos e resumos
   - Últimas transações

3. **Transações**
   - Listagem de transações
   - Adição/edição de transações
   - Filtros e buscas

4. **Configurações**
   - Perfil do usuário
   - Preferências
   - Moedas favoritas

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js (opcional, apenas para desenvolvimento fora do container)
- Ruby (opcional, apenas para desenvolvimento fora do container)

## Como Executar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/real-flux.git
cd real-flux

2. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto baseado no exemplo:
```bash
    cp .env.example .env
```

Edite o arquivo .env com suas configurações.

3. Inicie os containers
```bash
docker-compose build
docker-compose up
```

4. Acesse a aplicação
Frontend: http://localhost:4000

Backend: http://localhost:3000 (API)

MySQL: porta 3306

Comandos úteis
Parar os containers: docker-compose down

Rebuildar os containers: docker-compose up --build

Ver logs: docker-compose logs -f

Desenvolvimento
Frontend (Next.js)
Para desenvolver fora do container:
```bash
    cd frontend
    yarn install
    yarn dev
```

Backend (Ruby)
Para desenvolver fora do container:
```bash
    cd backend
    bundle install
    rails server
```

