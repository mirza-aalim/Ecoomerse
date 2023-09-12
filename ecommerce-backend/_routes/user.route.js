import { signup, login, getById, protectedRoute, forgotPassword, resetPassword } from '../_controllers/user.controller.js';
import { requireSignIn, isAdmin } from '../_middleware/auth.middleware.js';

export default (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        res.header('Content-Type', 'application/json; charset=utf-8');
        next();
    });
    app.post('/api/v1/auth/user/signup', signup);
    app.post('/api/v1/auth/user/login', login);
    app.post('/api/v1/auth/user/forgotPassword', forgotPassword);
    app.post('/api/v1/auth/user/resetPassword', resetPassword);
    app.get('/api/v1/auth/user/getById/:userId', requireSignIn, getById);
    app.get('/api/v1/auth/user/user-auth', requireSignIn, protectedRoute);
    app.get('/api/v1/auth/user/admin-auth', requireSignIn, isAdmin, protectedRoute);

}
