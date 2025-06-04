# Desafio 

## Descrição 
Trata-se de uma aplicação Angular que consome a API pública de Rick and Morty para exibir uma lista de personagens. A aplicação possibilita ao usuário realizar buscas por nome e aplicar filtros com base no status dos personagens. Além disso, conta com uma funcionalidade de rolagem infinita, que carrega automaticamente novos personagens à medida que o usuário navega para o final da página, e uma busca avançada que considera simultaneamente o nome e o status.

## Tecnologias Usadas
- **Angular**
- **TypeScript**
- **Bootstrap**
- **Chat GPT** (Auxiliou na elaboração da documentação e na otimização do projeto)

## Instalação
1. Clone o repositório:
    ```bash
    git clone 
    ```
2. Navegue até o diretório do projeto:
    ```bash
    cd Rick-and-Morty 
    ```
3. Instale as dependências:
    ```bash
    npm install
    ```
4. Inicie a aplicação:
    ```bash
    ng serve
    ```
5. Abra o navegador e acesse:
    ```plaintext
    http://localhost:4200
    ```

## Componentes Principais
### Pages
- **Characters**: Characters: Página principal, responsável por exibir a listagem de personagens.
- **Details**: Página destinada à exibição dos detalhes de um personagem específico.


## Testes unitários
1. Para rodar os testes:
    ```bash
   npm run test:coverage
    ```

### Serviços
- **DataService**: DataService: Serviço responsável por realizar as requisições HTTP à API de Rick and Morty e fornecer os dados necessários aos componentes.

### Rotas
- **App.routes.ts**: Arquivo responsável pela definição das rotas da aplicação, mapeando os caminhos para seus respectivos componentes.

## API de Rick and Morty
Para mais informações sobre a API utilizada neste projeto, consulte a [documentação oficial da API de Rick and Morty](https://rickandmortyapi.com/).

## Autora
Desenvolvido por Kyara Campos.



