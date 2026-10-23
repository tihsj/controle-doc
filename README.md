# Controle de Documentos HSJ — GitHub Pages + Firebase

## O que mudou

- Login por **nome de usuário e senha** (`secretaria`, `almoxarifado` etc.).
- Uma conta por setor, operada pelo gestor.
- Secretaria cria usuários, define senha inicial, redefine senha e bloqueia/reativa contas na área Administração.
- O Firebase Authentication usa internamente e-mails técnicos `usuario@hsj.local`. Esses endereços não recebem mensagens e não aparecem no login.
- Senhas são processadas pelo Firebase Authentication; não ficam gravadas no HTML ou no Firestore.
- Funções administrativas seguras em `functions/` exigem autorização de Secretaria.

## IMPORTANTE: projeto `ramais` já existente

**Não substitua as regras do Firestore do projeto `ramais` pelo arquivo `firestore.rules` deste pacote.** Isso poderia bloquear o sistema de ramais. O arquivo é uma **base de referência para um projeto novo e isolado**. Se insistir em compartilhar o projeto, é necessário combinar cuidadosamente as regras existentes com as novas, inspecionar conflitos nas coleções `users`, `documents`, `counters`, `sectors`, `recipients` e testar ambos os aplicativos antes de publicar.

**Recomendação: criar um projeto Firebase exclusivo para o Controle de Documentos HSJ**. O GitHub Pages pode continuar em qualquer repositório GitHub. Se optar por manter `ramais`, não implante as regras nem as funções sem revisar a compatibilidade.

## 1. Configurar Firebase

1. No Console Firebase, crie um projeto exclusivo (recomendado), por exemplo `controle-documentos-hsj`.
2. Em **Authentication > Sign-in method**, habilite **E-mail/senha**.
3. Em **Firestore Database**, crie o banco em modo de produção.
4. Em **Configurações do projeto > Seus aplicativos**, registre um app Web e copie o objeto `firebaseConfig` para `firebase-config.js`.
5. Em **Authentication > Settings > Authorized domains**, adicione o domínio de seu GitHub Pages, se necessário.
6. No Firestore, crie o documento `sectors/sec` com os campos `name` (string) = `Secretaria`, `active` (boolean) = `true`.
7. A conta **`secretaria@hsj.local`** já foi criada no Authentication. Não crie outra; confirme que o UID coincide com o documento em `users/{UID}`.
8. Copie o UID dessa conta e crie no Firestore o documento `users/<UID>` com os campos:
   - `username` (string): `secretaria`
   - `name` (string): `Secretaria`
   - `role` (string): `admin`
   - `sectorId` (string): `sec`
   - `sectorName` (string): `Secretaria`
   - `active` (boolean): `true`
9. **Não compartilhe a senha da Secretaria nem arquivos de conta de serviço.**

## 2. Instalar as funções administrativas

**Cloud Functions requerem plano Blaze (faturamento habilitado) e Firebase CLI/Node.js.** Confira custos e cotas antes de ativar.

No computador, instale Node.js e execute em um terminal na pasta deste pacote:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
cd functions
npm install
cd ..
firebase deploy --only functions
```

Selecione o projeto correto quando solicitado. As funções são publicadas em `southamerica-east1`, região usada no `app.js`.

## 3. Regras do Firestore

O arquivo `firestore.rules` é um ponto de partida para **projeto exclusivo**, não uma autorização para substituir regras do `ramais`. Em projeto exclusivo, revise e teste as regras no emulador antes de publicar:

```bash
firebase deploy --only firestore:rules
```

**Nota:** a consulta geral entre setores não está habilitada nesta versão conectada: gestores visualizam seus documentos, e a Secretaria visualiza todos. A consulta entre setores precisa de uma projeção de leitura específica e regras adicionais antes de produção.

## 4. GitHub Pages

Suba apenas estes arquivos para a raiz do repositório público:

- `index.html`
- `app.js`
- `firebase-config.js`

Em GitHub > Settings > Pages, selecione **Deploy from a branch**, branch `main`, pasta `/ (root)`.

**Não publique** `functions/`, arquivos de credenciais de serviço, `.env` ou senhas no GitHub Pages. As funções são implantadas pelo Firebase CLI, não pelo GitHub Pages.

## 5. Primeiro acesso e usuários

1. Acesse o site no GitHub Pages.
2. Entre com usuário `secretaria` e a senha definida no Firebase Authentication.
3. Na aba Administração, cadastre os setores.
4. Em Usuários dos setores, selecione o setor, informe um usuário único e uma senha inicial de pelo menos 8 caracteres.
5. O gestor acessa com seu usuário e senha. A Secretaria pode redefinir a senha ou bloquear a conta.

## Limitações e cuidados

- **Não testado contra seu projeto Firebase real.** Valide com dados fictícios e com pelo menos duas contas antes de usar documentos oficiais.
- A solução exige Functions implantadas, configuração correta, plano Blaze e regras seguras.
- O banco Firestore é compartilhado entre aplicativos do mesmo projeto; prefira isolamento para não prejudicar `ramais`.
- Não inclua dados clínicos/sensíveis no assunto ou destinatário sem avaliação institucional de segurança e LGPD.
- Um usuário por setor identifica o setor, não a pessoa física; mantenha o campo de funcionário responsável e restrinja o conhecimento da senha ao gestor.
- Os e-mails técnicos `.invalid` não podem receber recuperação de senha; a Secretaria redefine as senhas pelo sistema.

## Estado atual da instalação (23/10/2026)

- Projeto Firebase: `controle-doc-5683b`; aplicativo Web já registrado.
- Authentication e-mail/senha ativado. Conta `secretaria@hsj.local` criada.
- Documento `users/{UID}` da Secretaria criado com `active=true`, `role=admin`, `sectorId=sec`.
- **Pendente:** criar `sectors/sec` no Firestore, com `name` (string) = `Secretaria` e `active` (boolean) = `true`.
- **Pendente:** confirmar que as regras Firestore deste pacote são compatíveis com as regras publicadas, e implantar funções administrativas.
- **Pendente:** publicar `index.html`, `app.js`, `firebase-config.js` na raiz do repositório GitHub Pages e testar login.
- O acesso da Secretaria será com usuário `secretaria` e a senha da conta `secretaria@hsj.local`.
- Para outros setores, as funções criam contas `usuario@hsj.local`, que não são caixas de e-mail reais.
- Nunca publique arquivos de chave de conta de serviço no GitHub.
