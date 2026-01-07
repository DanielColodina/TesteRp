const Admin = require('../models/Admin');
const Usuario = require('../models/User');
const bcrypt = require('bcrypt');

// Expresão regular para validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validar entrada
  if (!email || !password) {
    return res.status(400).send('❌ Email e senha são obrigatórios');
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send('❌ Email inválido');
  }

  if (password.length < 6) {
    return res.status(400).send('❌ Senha inválida');
  }

  try {
    const admin = await Admin.findByEmail(email.toLowerCase().trim());
    if (!admin) {
      return res.status(401).send('❌ Email ou senha incorretos');
    }

    // Comparar senha
    const ok = await bcrypt.compare(password.trim(), admin.password);
    
    if (!ok) {
      return res.status(401).send('❌ Email ou senha incorretos');
    }

    // Definir sessão
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    
    console.log(`✅ Login bem-sucedido: ${email}`);
    res.redirect('/dashboard');
    
  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).send('❌ Erro ao processar login');
  }
};

exports.dashboard = async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }

  try {
    const Checklist = require('../models/Checklist');
    const User = require('../models/User');
    const checklists = await Checklist.findAllWithProgresso();
    const usuarios = await User.findAllByAdmin(req.session.adminId);

    // Calcular estatísticas
    const progressoMedio = checklists && checklists.length > 0
      ? (checklists.reduce((sum, item) => sum + (item.progresso || 0), 0) / checklists.length).toFixed(2)
      : 0;

    const totalUsuarios = usuarios ? usuarios.length : 0;
    const totalObras = checklists ? checklists.length : 0;
    const obrasCompletas = checklists ? checklists.filter(item => item.progresso === 100).length : 0;

    res.render('dashboard', {
      progressoMedio,
      totalUsuarios,
      totalObras,
      obrasCompletas
    });
  } catch (err) {
    console.error('❌ Erro ao carregar dashboard:', err);
    res.render('dashboard', {
      progressoMedio: 0,
      totalUsuarios: 0,
      totalObras: 0,
      obrasCompletas: 0
    });
  }
};

// LISTAGEM USUARIOS
exports.listUsuarios = async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }

  try {
    const usuarios = await Usuario.findAllWithAdmin();
    res.render('usuarios', { usuarios });
  } catch (err) {
    console.error('❌ Erro ao listar usuários:', err);
    res.status(500).send('❌ Erro ao listar usuários');
  }
};