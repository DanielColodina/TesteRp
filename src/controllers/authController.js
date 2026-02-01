const Admin = require('../models/Admin');
const Usuario = require('../models/User');
const Checklist = require('../models/Checklist');
const bcrypt = require('bcrypt');

// Logs apenas em desenvolvimento
const isDev = process.env.NODE_ENV !== 'production';

// Expressão regular para validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.loginPage = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (isDev) {
    console.log('Tentativa de login:', { email, password_length: password?.length });
  }

  // Validar entrada
  if (!email || !password) {
    return res.status(400).send('Email e senha sao obrigatorios');
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send('Email invalido');
  }

  if (password.length < 6) {
    return res.status(400).send('Senha invalida');
  }

  try {
    const admin = await Admin.findByEmail(email.toLowerCase().trim());
    
    if (!admin) {
      if (isDev) {
        console.log('Admin nao encontrado:', email);
      }
      return res.status(401).send('Email ou senha incorretos');
    }

    // Comparar senha
    const ok = await bcrypt.compare(password.trim(), admin.password);
    
    if (!ok) {
      if (isDev) {
        console.log('Senha incorreta para:', email);
      }
      return res.status(401).send('Email ou senha incorretos');
    }

    // Definir sessao
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    
    res.redirect('/dashboard');
    
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro ao processar login');
  }
};

exports.dashboard = async (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/login');
  }

  try {
    const checklists = await Checklist.findAllWithProgresso();
    const usuarios = await Usuario.findAllByAdmin(req.session.adminId);

    // Calcular estatisticas
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
    console.error('Erro ao carregar dashboard:', err);
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
    console.error('Erro ao listar usuarios:', err);
    res.status(500).send('Erro ao listar usuarios');
  }
};
