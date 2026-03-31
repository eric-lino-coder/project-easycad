projeto EASYCAD

Este projeto é um website de cadastro de usuários desenvolvido com Next.js.
Ele representa a implementação inicial de um CRUD (Create, Read, Update, Delete), com foco em aprendizado e estruturação de uma aplicação web moderna.

---- Status do Projeto----

🚧 Em desenvolvimento (versão inicial)

Este é o primeiro commit do projeto.
A aplicação ainda não possui integração com um backend ou banco de dados.

✨ Funcionalidades atuais
Cadastro de usuários
Listagem de usuários
Edição de dados
Exclusão de usuários
Interface com modais (cadastro, edição e exclusão)
🛠️ Tecnologias utilizadas
Next.js
React
TypeScript
Material UI (MUI)

▶️ Como rodar o projeto
npm install
npm run dev

Acesse no navegador:

http://localhost:3000
app/
├── api/
│ └── usuarios/
│ ├── dados.json
│ └── route.ts
│
├── components/
│ ├── DashboardLayout.tsx
│ ├── ModalCadastro.tsx
│ ├── ModalEditUser.tsx
│ ├── ModalDeleteUser.tsx
│ └── masks.ts
│
├── layout.tsx
├── page.tsx
└── theme.ts

⚠️ Observações
Os dados atualmente não são persistidos em um banco de dados
O projeto está sendo desenvolvido com foco em aprendizado de CRUD e organização de código
⚠️

🚧 Próximos passos
Integração com backend
Persistência de dados (banco de dados)
Validações mais robustas
Melhorias na UI/UX
🚧

👨‍💻 Autor

Desenvolvido Eric.lino.coder
