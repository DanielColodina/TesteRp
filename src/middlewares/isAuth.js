module.exports = function isAuth(req, res, next) {
    // Verificar se existe sessão e adminId
    if (req.session && req.session.adminId) {
        return next();
    }

    // Se não autenticado, redireciona para login
    return res.status(401).redirect('/login');
};