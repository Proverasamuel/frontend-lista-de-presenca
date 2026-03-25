# 📱 Sistema de Registro de Presença via QR Code

## 📌 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de **digitalizar o processo de registro de presenças em sala de aula**, que tradicionalmente era feito em papel.

A solução utiliza **QR Code** para permitir que os alunos registrem presença de forma rápida e automática, enquanto o delegado pode acompanhar tudo em tempo real.

---

## 🚀 Demonstração

🔗 Acesse a aplicação:
[https://lista-de-presenca-app.netlify.app/login](https://lista-de-presenca-app.netlify.app/login)

---

## 🧠 Problema

O processo manual de registro de presenças apresenta vários desafios:

* 📄 Uso excessivo de papel
* ❌ Erros no preenchimento
* 🕒 Processo demorado
* 📉 Dificuldade no controle e organização

---

## 💡 Solução

Foi desenvolvida uma aplicação web que permite:

* ✅ Criar aulas com QR Code único
* 📷 Alunos marcarem presença via scanner
* 📊 Delegado visualizar presenças em tempo real
* 📄 Exportar presenças em PDF
* 🔐 Controle de acesso por perfil (Delegado / Aluno)

---

## 🛠️ Tecnologias Utilizadas

### 🔹 Frontend

* Angular
* Tailwind CSS
* Netlify (Deploy)

### 🔹 Backend

* Node.js
* Express
* Render (Deploy)

### 🔹 Banco de Dados & Auth

* Firebase (Firestore + Authentication)

---

## 🔗 Arquitetura

A aplicação segue uma arquitetura **cliente-servidor (SPA + API REST)**:

```
Frontend (Angular - Netlify)
        ↓
API REST (Node.js - Render)
        ↓
Firebase (Firestore)
```

* O frontend comunica com o backend via **HTTP (REST API)**
* O backend gerencia regras de negócio e persistência no Firebase

---

## ⚙️ Funcionalidades

### 👨‍🎓 Aluno

* Login no sistema
* Escanear QR Code
* Marcar presença automaticamente
* Inserir código manual (fallback)

### 👨‍🏫 Delegado

* Criar aulas
* Gerar QR Code
* Visualizar presenças por aula
* Exportar lista em PDF

---

## 🔐 Controle de Acesso

* **Delegado:** acesso ao dashboard e gestão de aulas
* **Aluno:** acesso apenas ao registro de presença

Proteção de rotas implementada com:

* AuthGuard
* RoleGuard

---

## 📦 Instalação Local

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
```

---

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

---

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

---

## 🌐 Deploy

* Frontend: Netlify
* Backend: Render
* Banco de Dados: Firebase

---

## 📄 Exportação de Presenças

O sistema permite exportar as presenças em **PDF**, contendo:

* Disciplina
* Aula
* Lista de alunos
* Data e hora do registro
* Status (Presente/Ausente)

---

## 📈 Melhorias Futuras

* 📱 Aplicação mobile
* 🔔 Notificações em tempo real
* 📊 Dashboard com estatísticas
* 🧾 Histórico completo por aluno
* 🔐 Autenticação com JWT mais robusta

---

## 👨‍💻 Autor

**Provera Samuel**
Desenvolvedor Web Fullstack
