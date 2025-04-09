FROM node:18-alpine

# Configura o diretório da aplicação
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json yarn.lock ./

# Instala dependências
RUN yarn install

# Copia o código da aplicação
COPY . .

# Porta exposta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "dev"]