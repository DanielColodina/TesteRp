const logger = require('../utils/logger');

module.exports = function isAuth(req, res, next) {
    logger.info(`[AUTH] Verificando autenticação para ${req.path}`);

    // Verificar se existe sessão e adminId
    if (req.session && req.session.adminId) {
        logger.info(`[AUTH] Usuário autenticado: ${req.session.adminId}`);
        return next();
    }

    logger.warn(`[AUTH] Acesso negado para ${req.path} - sessão inválida`);
    // Se não autenticado, redireciona para login
    return res.status(401).redirect('/login');
};