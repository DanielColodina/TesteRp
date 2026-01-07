# 🧪 TESTE MANUAL DO SISTEMA - GUIA PRÁTICO

## 1️⃣ TESTES DE USUÁRIOS

### Procedimento:
1. Acesse: http://localhost:3000/login
2. Login: `admin@empresa.com` / `123456`
3. Clique em "Usuários"

### Verificações:
- ✅ Deve listar 6 usuários
- ✅ Deve mostrar: Nome, Email, Telefone, Endereço, Obra, Admin
- ✅ Botões: Editar, Deletar devem estar visíveis

### Dados Esperados:
```
1. Daniel (admin@empresa.com) - Obra A
2. Daniel Test (teste@teste.com) - Obra B
3. Arroz Silva (silvasktnj@gmail.com) - Obra C
4. Daniel Assunção (danielassuncao1129@gmail.com) - Obra D
5. MARIA ANTONIA SANTOS OLIVEIRA (teste2@teste.com) - Obra E
6. Teste Novo (novo@teste.com) - Obra Teste
```

---

## 2️⃣ TESTE DE CRIAR USUÁRIO

### Procedimento:
1. Na página de usuários, clique em "Criar Novo Usuário"
2. Preencha os campos:
   - Nome: "Teste Manual"
   - Email: "teste.manual@teste.com"
   - Telefone: "11988776655"
   - Endereço: "Rua Manual, 123"
   - Obra: "Obra Manual"
3. Clique "Salvar"

### Validações Esperadas:
- ✅ Não permitir email sem @
- ✅ Não permitir telefone com menos de 10 dígitos
- ✅ Não permitir campos vazios
- ✅ Após salvar, redirecionar para lista de usuários

---

## 3️⃣ TESTE DE CHECKLIST

### Procedimento:
1. Na lista de usuários, clique no botão "Ver" ou no nome do usuário (ID 1 - Daniel)
2. Deve abrir um modal com 6 campos:
   - Uso Solo
   - Licença
   - Condomínio
   - Habite-se
   - Averbação
   - Vistoria

### Cada campo deve ter as opções:
- Feito
- Andamento
- Finalizado
- Próxima Etapa
- Não Tem (padrão)

### Validações:
- ✅ Todos os campos iniciam com "Não Tem"
- ✅ Pode selecionar outros valores
- ✅ Deve ter botão "Salvar" para confirmar alterações
- ✅ Deve mostrar progresso em % (0-100%)

---

## 4️⃣ TESTE DE ALTERAÇÃO E SALVAMENTO

### Procedimento:
1. No modal de checklist (usuário Daniel - ID 1)
2. Altere "Uso Solo" para "Feito"
3. Altere "Licença" para "Andamento"
4. Clique "Salvar"

### Esperado:
- ✅ Modal desaparece ou fecha
- ✅ Mostra mensagem de sucesso
- ✅ Progresso muda de 0% para 16.67% (1 de 6 campos = Finalizado)
- ✅ Ao reabrir o modal, valores devem estar salvos

---

## 5️⃣ TESTE DE HISTÓRICO

### Procedimento:
1. Ainda no modal do usuário, procure aba "Histórico"
2. Deve listar todas as alterações feitas

### Esperado:
- ✅ Registro: "Campo uso_solo alterado de Não Tem para Feito"
- ✅ Registro: "Campo licenca alterado de Não Tem para Andamento"
- ✅ Data e hora dos registros
- ✅ Admin que fez a alteração

---

## 6️⃣ TESTE DE AUDITORIA

### Procedimento:
1. Clique em "Dashboard" > "Auditoria"
2. Deve mostrar todos os logs de alterações do sistema

### Esperado:
- ✅ Ação: CHECKLIST_ATUALIZADO
- ✅ Campo alterado: uso_solo, licenca
- ✅ Valores anterior e novo
- ✅ Admin e usuário que fez a alteração
- ✅ Data/Hora

---

## 7️⃣ TESTE DE PROGRESSO

### Procedimento:
1. Clique em "Dashboard" > "Progresso da Obra"
2. Deve mostrar tabela com todos os usuários e progresso em %

### Esperado:
- ✅ Daniel: 16.67% (1 de 6 Finalizado)
- ✅ Outros: 0% (nenhum Finalizado)
- ✅ Gráfico ou indicador visual do progresso
- ✅ Cores: Verde (100%), Amarelo (1-99%), Vermelho (0%)

---

## 8️⃣ VALIDAÇÕES DE BANCO DE DADOS

### Estrutura de Tabelas:
```
✅ admins (1 registro: admin@empresa.com)
✅ usuarios (6 registros com IDs 1-6)
✅ checklist_usuarios (5 registros, ID 6 sem checklist)
✅ historico (registros de alterações)
✅ auditoria (logs de alterações)
✅ obras (vazio, mas criada)
✅ etapas_obra (vazio, mas criada)
```

### Validações de Dados:
- ✅ Todos os emails são válidos (contêm @)
- ✅ Todos os telefones têm 10 ou 11 dígitos
- ✅ Campos obrigatórios preenchidos
- ✅ ENUM values respeitam as 5 opções

---

## 9️⃣ TESTE DE EDIÇÃO DE USUÁRIO

### Procedimento:
1. Na lista de usuários, clique "Editar" em qualquer usuário
2. Altere pelo menos 1 campo (ex: nome ou telefone)
3. Clique "Salvar"

### Esperado:
- ✅ Valida email (não permite inválido)
- ✅ Valida telefone (não permite < 10 dígitos)
- ✅ Após salvar, volta à lista de usuários
- ✅ Dados atualizados na lista

---

## 🔟 TESTE DE DELEÇÃO

### Procedimento:
1. Na lista de usuários, clique "Deletar" em um usuário (use "Teste Novo" ID 6)
2. Confirme a exclusão

### Esperado:
- ✅ Usuário removido da lista
- ✅ Auditoria registra: USUARIO_DELETADO
- ✅ Não deve gerar erro SQL
- ✅ Não deve deletar outros usuários

---

## 📋 CHECKLIST DE FUNCIONALIDADES

| Funcionalidade | Status | Teste | Observações |
|---|---|---|---|
| Login com admin@empresa.com | ✅ | Manual | Funciona |
| Listar usuários | ✅ | Manual | 6 usuários cadastrados |
| Criar usuário | ✅ | Script | Validações OK |
| Editar usuário | ⚠️ | Pendente | Verificar após testes |
| Deletar usuário | ⚠️ | Pendente | Verificar após testes |
| Carregar checklist | ✅ | Script | Retorna JSON com valores |
| Atualizar checklist | ✅ | Script | Salva ENUM values |
| Calcular progresso | ✅ | Script | 16.67% = 1/6 finalizado |
| Registrar histórico | ✅ | Script | Registros salvos |
| Registrar auditoria | ✅ | Script | Logs salvos |
| Validação frontend | ⚠️ | Manual | Modal com selects |
| Botão Salvar | ✅ | Visual | Presente no modal |

---

## 🎯 RESUMO FINAL

### ✅ SISTEMA OPERACIONAL
- Servidor rodando: http://localhost:3000
- Banco de dados: rp_empreendimentos (MySQL)
- 6 Usuários cadastrados com dados válidos
- Todas as tabelas criadas com integridade referencial
- Validações funcionando no backend

### ⚠️ ITENS A VERIFICAR MANUALMENTE
1. Modal de checklist abre sem erros
2. Selects mostram as 5 opções de ENUM
3. Botão "Salvar" está visível no modal
4. Após alterar e salvar, progresso atualiza
5. Histórico exibe registros de alterações
6. Auditoria registra todas as ações

### 📝 PRÓXIMOS PASSOS
1. Testes manuais no navegador (itens acima)
2. Verificar UI/UX dos modals
3. Validar comportamento de botões
4. Testar responsividade da interface

---

**Data do Teste:** 05/01/2026
**Ambiente:** Development (Windows)
**Servidor:** Node.js com Express
**Banco:** MySQL 8.0
