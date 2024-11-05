
# Encurtador de URLs

## Descrição
Este é um sistema de API RESTful para encurtar URLs, com suporte para autenticação de usuários. Usuários autenticados podem criar URLs encurtadas, visualizá-las, editá-las, excluí-las e verificar a contagem de cliques em cada URL.

## Tecnologias
- **Node.js**: Ambiente de execução JavaScript.
- **NestJS**: Framework Node.js para construção de APIs escaláveis.
- **TypeORM**: ORM para manipulação de banco de dados relacional.
- **JWT**: Token para autenticação de usuários.
- **Swagger**: Documentação de API.
- **Docker**: Contêineres para configuração do ambiente.

## Configuração do Projeto

### Variáveis de Ambiente
O sistema funciona sem precisar adicionar variaveis de ambiente por padrão, mas caso queira adicionar As variáveis principais são:
- `JWT_SECRET`: Chave para assinatura dos tokens JWT.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`: Dados para conexão com o banco de dados.

### Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiovalverde20/Encurtador-URL.git
   cd Encurtador-URL
   ```

2. Se quiser configure as variáveis de ambiente em um arquivo `.env`.

3. Execute com Docker:
   ```bash
   docker-compose up --build
   ```

4. Documentação da API:
   Acesse a documentação no Swagger em `http://localhost:3000/api` após iniciar a aplicação.

### Comandos Importantes

- `npm run start:dev`: Executa o servidor em modo de desenvolvimento.
- `npm run test`: Executa os testes unitários.

### Testes
Os testes incluem:
- **Testes de Autenticação**: Verificam login, registro e geração de token.
- **Testes de Rotas de URL**: Encurtamento, edição, exclusão, contagem de cliques e listagem.

### Melhorias Futuras
- **Deploy em ambiente de nuvem** para maior acessibilidade e escalabilidade.
- **Cobertura de testes mais ampla** com integração e e2e.
- **Observabilidade**: Adicionar métricas, rastreamento e logging.

### Compatibilidade
Para este projeto, foi utilizada a versão 20 do Node.js e ele foi testado também na versão 18
