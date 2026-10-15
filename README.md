# Sistema de Apoio ao Coordenador

Protótipo web acadêmico para facilitar a consulta de dúvidas frequentes dos alunos e apoiar o coordenador acadêmico. A navegação foi organizada para demonstrar as nove etapas do protótipo: abertura, início do aluno, resultados da busca, resposta, login, painel administrativo, gerenciamento, nova pergunta e edição de pergunta.

## Como executar
1. Baixe ou clone este repositório.
2. Mantenha a estrutura de pastas como está.
3. Abra o arquivo `index.html` em um navegador moderno.
4. Não é necessário instalar dependências para executar o protótipo localmente.

> Para testar, baixe o repositório pelo botão **Code → Download ZIP** no GitHub. Abrir o HTML diretamente no GitHub não executa a aplicação como um site.

## Telas e funcionalidades
- **Abertura:** apresentação do sistema e botão para começar.
- **Início do aluno:** perguntas frequentes, categorias e campo de busca.
- **Resultados:** lista filtrada por palavra-chave ou categoria.
- **Resposta:** conteúdo completo da dúvida selecionada.
- **Login:** acesso demonstrativo à área administrativa.
- **Painel do coordenador:** contagem de perguntas e categorias e atalhos administrativos.
- **Gerenciamento:** listagem, filtro, edição e exclusão de perguntas.
- **Nova pergunta:** cadastro de pergunta, categoria e resposta.
- **Editar pergunta:** atualização dos dados cadastrados.
- Armazenamento local das perguntas com `localStorage`.

## Credenciais de demonstração
- E-mail: `coordenador@anhanguera.com`
- Senha: `123456`

Essas credenciais servem apenas para apresentar o protótipo. Não use esse mecanismo em produção.

## Estrutura do código
- `index.html`: estrutura das telas e formulários.
- `css/estilo.css`: identidade visual responsiva, cores e componentes.
- `js/app.js`: navegação entre telas, pesquisa, login demonstrativo e operações de cadastro, edição e exclusão.

## Tecnologias
HTML5, CSS3 e JavaScript, sem bibliotecas externas.

## Limitações importantes
Este projeto é um **protótipo front-end acadêmico**, não um sistema institucional pronto para uso real. O login é demonstrativo e não oferece autenticação segura. As perguntas são armazenadas apenas no navegador usado para o teste; não há servidor, banco de dados compartilhado, perfis reais de usuários ou sincronização entre dispositivos.