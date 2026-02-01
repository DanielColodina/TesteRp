const User = require('../models/User');
const Checklist = require('../models/Checklist');
const Auditoria = require('../models/Auditoria');
const Historico = require('../models/Historico');
// SQLite desabilitado para Render
// const Database = require('better-sqlite3');
// const path = require('path');

// Database CONTROLEGERAL
// const dbPath = path.join(__dirname, '../../CONTROLEGERAL/backend/construtora.db');
// let sqliteDb;
// try {
//   sqliteDb = new Database(dbPath);
//   console.log('✅ Conectado ao banco CONTROLEGERAL para usuários');
// } catch (err) {
//   console.error('Erro ao conectar ao banco CONTROLEGERAL para usuários:', err.message);
// }
const sqliteDb = null;

// Validações
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telefoneRegex = /^\d{10,11}$/;

// CRIAR USUÁRIO
exports.create = async (req, res) => {
  const { nome, email, telefone, endereco, obra, uso_solo, licenca, condominio, habite_se, averbacao, vistoria, observacoes } = req.body;

  // Validações
  if (!nome || !email || !endereco || !obra || !telefone) {
    return res.status(400).send('❌ Todos os campos são obrigatórios');
  }

  if (nome.length < 3) {
    return res.status(400).send('❌ Nome deve ter pelo menos 3 caracteres');
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send('❌ Email inválido');
  }

  const telefoneLimpo = telefone.replace(/\D/g, '');
  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    return res.status(400).send('❌ Telefone deve ter 10 ou 11 dígitos');
  }

  try {
    // Criar usuário
    const userId = await User.create(
      nome.trim(),
      email.toLowerCase().trim(),
      telefone.trim(),
      endereco.trim(),
      obra.trim(),
      req.session.adminId
    );

    // Se obra foi fornecida, inserir no controle geral
    // Comentado para evitar problemas com SQLite no Render
    /*
    if (obra && obra.trim()) {
      try {
        sqliteDb.prepare(`INSERT INTO obras (nome, endereco, cliente, orcamento, data_inicio, data_fim, status) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(obra.trim(), obra.trim(), nome.trim(), null, null, null, 'ativo');
        console.log(`✅ Obra inserida no controle geral para usuário: ${nome}`);
      } catch (err) {
        console.error('Erro ao inserir obra no controle geral:', err);
      }
    }
    */

    // Criar checklist inicial se dados foram fornecidos
    if (userId && (uso_solo || licenca || condominio || habite_se || averbacao || vistoria)) {
      await Checklist.createIfNotExists(userId);

      const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      for (const campo of camposChecklist) {
        if (req.body[campo] && req.body[campo] !== 'Nao Tem') {
          await Checklist.update(userId, campo, req.body[campo]);
          // Registrar auditoria
          await Auditoria.log(req.session.adminId, userId, 'CHECKLIST_INICIAL', campo, 'Nao Tem', req.body[campo]);
        }
      }

      // Salvar observações se fornecidas
      if (observacoes && observacoes.trim()) {
        await Checklist.updateObservacoes(userId, observacoes.trim());
      }

      // Registrar histórico da criação com checklist
      await Historico.registrar(userId, 'usuario', `Usuário criado com checklist inicial`, req.session.adminId);
    } else {
      // Registrar apenas criação do usuário
      await Historico.registrar(userId, 'usuario', `Usuário criado`, req.session.adminId);
    }

    console.log(`✅ Usuário criado com checklist inicial: ${email}`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Erro ao criar usuário:', err);
    res.status(500).send('❌ Erro ao criar usuário');
  }
};

// LISTAR USUÁRIOS
exports.list = async (req, res) => {
  try {
    const { search } = req.query;
    let usuarios = await User.findAllWithAdmin();
    
    // Filtrar por nome se houver busca
    if (search && search.trim()) {
      usuarios = usuarios.filter(u => 
        u.nome && u.nome.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.render('tablesUsers', { usuarios, search: search || '' });
  } catch (err) {
    console.error('❌ Erro ao listar usuários:', err);
    res.status(500).send('❌ Erro ao listar usuários');
  }
};

// DELETE
exports.delete = async(req,res) => {
  try{
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).send('❌ ID inválido');
    }

    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).send('❌ Usuário não encontrado');
    }

    // Registrar auditoria antes de deletar
    await Auditoria.log(req.session.adminId, id, 'USUARIO_DELETADO', 'usuario', usuario.nome, null);

    // Deletar dados relacionados primeiro (por causa das foreign keys)
    const db = require('../database/connection');

    // Deletar checklist
    try {
      await db.execute('DELETE FROM checklist_usuarios WHERE usuario_id = ?', [id]);
    } catch (err) {
      console.warn('⚠️ Erro ao deletar checklist (pode não existir):', err.message);
    }

    // Deletar histórico
    try {
      await db.execute('DELETE FROM historico WHERE usuario_id = ?', [id]);
    } catch (err) {
      console.warn('⚠️ Erro ao deletar histórico (pode não existir):', err.message);
    }

    // Deletar auditoria
    try {
      await db.execute('DELETE FROM auditoria WHERE usuario_id = ?', [id]);
    } catch (err) {
      console.warn('⚠️ Erro ao deletar auditoria (pode não existir):', err.message);
    }

    // Deletar obras associadas
    try {
      await db.execute('DELETE FROM obras WHERE usuario_id = ?', [id]);
    } catch (err) {
      console.warn('⚠️ Erro ao deletar obras (pode não existir):', err.message);
    }

    // Finalmente deletar o usuário
    await User.deleteById(id);

    console.log(`✅ Usuário e todos os dados relacionados deletados permanentemente: ${usuario.nome}`);
    res.redirect('/dashboard/tablesUsers');
  } catch (err) {
    console.error('❌ Erro ao excluir usuário:', err);
    res.status(500).send('❌ Erro ao excluir usuário');
  }
};

// EDIT PAGE
exports.editpage = async(req,res) => {
  try{
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).send('❌ ID inválido');
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('❌ Usuário não encontrado');
    }

    // Carregar checklist
    let checklist = await Checklist.findByUser(id);
    if (!checklist) {
      checklist = {
        usuario_id: id,
        uso_solo: null,
        licenca: null,
        condominio: null,
        habite_se: null,
        averbacao: null,
        vistoria: null,
        observacoes: ''
      };
    }

    res.render('editUser', { user, checklist });
  } catch (err) {
    console.error('❌ Erro ao carregar usuário:', err);
    res.status(500).send('❌ Erro ao carregar usuário');
  }
};

// UPDATE
exports.update = async(req,res) => {
  try{
    const { id } = req.params;
    const { nome, email, telefone, endereco, obra, uso_solo, licenca, condominio, habite_se, averbacao, vistoria, observacoes } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).send('❌ ID inválido');
    }

    // Validações
    if (!nome || !email || !telefone || !endereco || !obra) {
      return res.status(400).send('❌ Todos os campos são obrigatórios');
    }

    if (!emailRegex.test(email)) {
      return res.status(400).send('❌ Email inválido');
    }

    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).send('❌ Usuário não encontrado');
    }

    await User.update(id, nome.trim(), email.toLowerCase().trim(), telefone.trim(), endereco.trim(), obra.trim());

    // Atualizar checklist se os campos foram enviados
    if (uso_solo !== undefined || licenca !== undefined || condominio !== undefined ||
        habite_se !== undefined || averbacao !== undefined || vistoria !== undefined) {

      await Checklist.createIfNotExists(id);

      const camposChecklist = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
      for (const campo of camposChecklist) {
        if (req.body[campo] !== undefined) {
          const valor = req.body[campo];
          if (['Nao Tem', 'Andamento', 'Feito', 'Finalizado', 'Proxima-Etapa'].includes(valor)) {
            await Checklist.update(id, campo, valor);
            // Registrar auditoria para cada campo alterado
            await Auditoria.log(req.session.adminId, id, 'CHECKLIST_ATUALIZADO', campo, 'desconhecido', valor);
          }
        }
      }

      // Atualizar observações
      if (observacoes !== undefined) {
        await Checklist.updateObservacoes(id, observacoes || '');
      }
    }

    // Registrar auditoria
    await Auditoria.log(req.session.adminId, id, 'USUARIO_ATUALIZADO', 'usuario', usuario.nome, nome);

    console.log(`✅ Usuário atualizado: ${email}`);

    // Verificar se veio do dashboard (obras recentes)
    const referer = req.get('Referer') || '';
    if (referer.includes('/dashboard')) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/dashboard/tablesUsers');
    }
  } catch(err) {
    console.error('❌ Erro ao atualizar usuário:', err);
    res.status(500).send('❌ Erro ao atualizar usuário');
  }
};

// HISTÓRICO
exports.historico = async(req,res) => {
  try{
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const historico = await User.getHistoricoByUsuario(id);
    res.json(historico || []);
  } catch (err) {
    console.error('❌ Erro ao buscar histórico:', err);
    res.status(500).json([]);
  }
};

// CHECKLIST
exports.getChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await Checklist.createIfNotExists(id);
    let checklist = await Checklist.findByUser(id);
    const progresso = await Checklist.getProgresso(id);

    // Se não encontrar checklist, retornar objeto vazio com valores padrão
    if (!checklist) {
      checklist = {
        usuario_id: id,
        uso_solo: 'Nao Tem',
        licenca: 'Nao Tem',
        condominio: 'Nao Tem',
        habite_se: 'Nao Tem',
        averbacao: 'Nao Tem',
        vistoria: 'Nao Tem'
      };
    }

    res.json({ ...checklist, progresso: progresso.progresso });
  } catch (err) {
    console.error('❌ Erro ao buscar checklist:', err);
    res.status(500).json({ error: 'Erro ao carregar checklist' });
  }
};

exports.updateChecklist = async (req, res) => {
  try {
    const { campo, valor, admin_override } = req.body;
    const { id } = req.params;
    const adminId = req.session.adminId;

    // PROTEÇÃO: Só permitir atualizações diretas se admin_override for true
    // Isso força que mudanças sejam feitas apenas na edição completa do usuário
    if (!admin_override || admin_override !== true) {
      return res.status(403).json({
        success: false,
        error: 'Atualizações diretas do checklist estão bloqueadas. Use a edição completa do usuário para modificar o status inicial.'
      });
    }

    // Validações rigorosas
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, error: 'ID do usuário inválido' });
    }

    if (!campo || typeof campo !== 'string' || campo.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Campo é obrigatório e deve ser uma string válida' });
    }

    if (!valor || typeof valor !== 'string' || valor.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Valor é obrigatório e deve ser uma string válida' });
    }

    const camposValidos = ['uso_solo', 'licenca', 'condominio', 'habite_se', 'averbacao', 'vistoria'];
    if (!camposValidos.includes(campo.trim())) {
      return res.status(400).json({ success: false, error: `Campo inválido. Campos válidos: ${camposValidos.join(', ')}` });
    }

    const valoresValidos = ['Nao Tem', 'Andamento', 'Feito', 'Finalizado', 'Proxima-Etapa'];
    if (!valoresValidos.includes(valor.trim())) {
      return res.status(400).json({ success: false, error: `Valor inválido. Valores válidos: ${valoresValidos.join(', ')}` });
    }

    // Verificar se usuário existe
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }

    // Garantir que existe registro
    await Checklist.createIfNotExists(id);

    const checklistAnterior = await Checklist.findByUser(id);
    const valorAnterior = (checklistAnterior && checklistAnterior[campo]) ? checklistAnterior[campo] : 'Nao Tem';

    // Atualizar checklist (tenta atualizar, se não existir linha cria e tenta novamente)
    let updated = await Checklist.update(id, campo, valor);
    if (!updated) {
      // tentar criar registro e atualizar novamente
      await Checklist.createIfNotExists(id);
      updated = await Checklist.update(id, campo, valor);
    }

    if (!updated) {
      // não conseguiu salvar
      console.error('❌ Não foi possível salvar o checklist para usuário', id);
      return res.status(500).json({ success: false, error: 'Não foi possível salvar checklist' });
    }

    // Registrar auditoria
    await Auditoria.log(adminId, id, 'CHECKLIST_ATUALIZADO', campo, valorAnterior, valor);

    // Registrar histórico
    await Historico.registrar(id, 'checklist', `Campo ${campo} alterado de ${valorAnterior} para ${valor}`, adminId);

    const progresso = await Checklist.getProgresso(id);
    res.json({ success: true, progresso: progresso.progresso });
  } catch (err) {
    console.error('❌ Erro ao atualizar checklist:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar checklist' });
  }
};

exports.updateObservacoes = async (req, res) => {
  try {
    const { observacoes } = req.body;
    const { id } = req.params;
    const adminId = req.session.adminId;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' });
    }

    await Checklist.createIfNotExists(id);

    // Observações podem ser vazias
    const observacoesValue = (observacoes !== undefined && observacoes !== null) ? observacoes : '';

    const updated = await Checklist.updateObservacoes(id, observacoesValue);
    if (!updated) {
      return res.status(500).json({ success: false, error: 'Não foi possível salvar observações' });
    }

    // Registrar histórico apenas se houve mudança significativa
    if (observacoesValue.trim().length > 0) {
      await Historico.registrar(id, 'observacoes', 'Observações atualizadas', adminId);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erro ao atualizar observações:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar observações' });
  }
};

// BUSCAR AUDITORIA
exports.auditoria = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const logs = await Auditoria.findByUsuario(id);
    res.json(logs || []);
  } catch (err) {
    console.error('❌ Erro ao buscar auditoria:', err);
    res.status(500).json([]);
  }
};
// PROGRESSO DA OBRA
exports.progresso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido', progresso: 0 });
    }

    const progresso = await Checklist.getProgresso(id);
    res.json(progresso);
  } catch (err) {
    console.error('❌ Erro ao buscar progresso:', err);
    res.status(500).json({ progresso: 0, error: err.message });
  }
};

// API PARA BUSCAR USUÁRIOS DO ADMIN (PARA DROPDOWN)
exports.getUsuariosForDropdown = async (req, res) => {
  try {
    const adminId = req.session.adminId;

    if (!adminId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const usuarios = await User.findAllByAdmin(adminId);
    const usuariosFormatados = usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      obra: u.obra
    }));

    res.json({ usuarios: usuariosFormatados });
  } catch (err) {
    console.error('❌ Erro ao buscar usuários para dropdown:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// AUTOCOMPLETE - BUSCAR USUÁRIOS POR NOME
exports.searchAutocomplete = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    const usuarios = await User.findAllWithAdmin();
    const filtrados = usuarios.filter(u => 
      u.nome && u.nome.toLowerCase().includes(q.toLowerCase())
    );

    const resultados = filtrados.slice(0, 10).map(u => ({
      id: u.id,
      nome: u.nome
    }));

    res.json(resultados);
  } catch (err) {
    console.error('❌ Erro na busca autocomplete:', err);
    res.json([]);
  }
};


