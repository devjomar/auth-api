# README

## Autenticação e Autorização com Express, Bcrypt e JSON Web Token

Este projeto demonstra um exemplo básico de como implementar autenticação e autorização em uma API usando Express, Bcrypt e JSON Web Token (JWT). Embora este código possa ser utilizado em uma aplicação real, é importante ressaltar que em um ambiente de produção, recomenda-se adicionar mais camadas de segurança.

### Estrutura do Projeto

A estrutura do projeto está organizada na pasta `src`, contendo:

- **src/index.js**: Configurações iniciais da aplicação Express.
- **src/middleware.js**: Middleware para verificação de tokens em rotas privadas.
- **src/routes/**: Contém controllers e serviços para cada rota.
- **src/models/**: Classes que simulam o banco de dados e o cache em memória.

### Configuração do Ambiente

É necessário ter um arquivo `.env` na raiz do projeto que contém a chave secreta para a geração do token JWT. O arquivo deve ter a seguinte estrutura:

```
SECRET=suachavesecreta
```

### Rotas

- **Públicas**:
  - `POST /register`: Registra um novo usuário (inclui a definição de role).
  - `POST /login`: Realiza login e gera um token JWT.

- **Privadas**:
  - `GET /users`: Retorna informações do usuário autenticado.
  - `DELETE /unregister`: Remove o próprio usuário do sistema.
  - `POST /logout`: Revoga o token JWT do usuário.
  - `DELETE /remove`: Remove um usuário do sistema, acessível apenas para admins.

### Requisitos

- Node.js
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone <https://github.com/devjomar/auth-api.git>
   cd <auth-api>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz do projeto e adicione sua chave secreta.

### Configuração Inicial

No arquivo `src/index.js`, você encontrará a configuração básica do Express, incluindo as rotas e a inicialização do servidor.

### Autenticação

A autenticação é realizada utilizando o Bcrypt para hashear senhas e o JSON Web Token para a geração de tokens. O fluxo básico é:

1. **Registro**: O usuário se cadastra informando um nome de usuário, uma senha e uma role.
   - A senha é hasheada com Bcrypt antes de ser armazenada no banco de dados.
   - A role pode ser definida no registro, mas é recomendado que o gerenciamento de roles seja feito de forma mais segura, como um admin inicial que define a role de admin.
   
2. **Login**: O usuário faz login fornecendo credenciais.
   - As credenciais são verificadas e, se válidas, um JWT é gerado e retornado ao cliente.

### Autorização

A autorização é realizada através do middleware `src/middleware.js`, que intercepta requisições em rotas privadas. O middleware faz o seguinte:

1. Extrai o token do cabeçalho da requisição.
2. Verifica a validade do token.
3. Verifica se o token está na blacklist (se um usuário fez logout).
4. Se o token for válido e não estiver na blacklist, permite o acesso à rota, considerando a role do usuário.

### Blacklist de Tokens

Uma classe de cache em memória simula a blacklist de tokens que foram revogados (logout). Para um sistema em produção, recomenda-se utilizar Redis para gerenciar esta blacklist, permitindo a adição de um temporizador que apaga tokens expirados automaticamente.

### Uso de Banco de Dados

Você pode usar qualquer banco de dados relacional ou não-relacional para armazenar os usuários. Basta adaptar a implementação da classe que gerencia usuários na pasta `src/models/`.

### Validação de Dados

Embora não tenha sido utilizado neste projeto, é altamente recomendado usar uma biblioteca de validação de dados, como o Zod, para garantir que as entradas do usuário estejam no formato correto.

### Exemplo de Uso

#### Registrar Usuário

```http
POST /register
Content-Type: application/json

{
  "username": "exemplo",
  "password": "minhasenha",
  "role": "user"  // Apenas para exemplo, gerenciamento seguro é recomendado
}
```

#### Login

```http
POST /login
Content-Type: application/json

{
  "username": "exemplo",
  "password": "minhasenha"
}
```

#### Acesso a Rota Privada

```http
GET /users
Authorization: Bearer <token_jwt>
```

#### Acesso a Rota Restrita (Admin)

```http
DELETE /remove
Authorization: Bearer <token_jwt>  // Necessário ter role de admin no payload
```

#### Remover Próprio Usuário

```http
DELETE /unregister
Authorization: Bearer <token_jwt>  // Apenas o próprio usuário pode acessar
```

### Testando o Fluxo do Usuário

Para facilitar o teste do fluxo do usuário, um arquivo chamado `example.http` está incluído. Este arquivo contém todas as requisições necessárias para simular o registro, login e acesso às rotas privadas.

### Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou pull request.

### Licença

Este projeto está licenciado sob a MIT License. Consulte o arquivo LICENSE para mais detalhes.

---

**Nota:** Este é um exemplo básico e deve ser complementado com mais camadas de segurança para ser utilizado em uma aplicação real. Considere medidas como criptografia adicional, limitação de taxa, auditoria de logs e validações mais rigorosas. Para mais informações ou dúvidas, consulte a documentação do Express, Bcrypt e JSON Web Token.