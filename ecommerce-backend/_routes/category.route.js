import { create, update, getAll, getById, deleteCategory } from '../_controllers/category.controller.js'
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
    app.post('/api/v1/category/create', requireSignIn, isAdmin, create);
    app.post('/api/v1/category/update', requireSignIn, isAdmin, update);
    app.get('/api/v1/category/getAll', requireSignIn, isAdmin, getAll);
    app.get('/api/v1/category/getById/:id', requireSignIn, isAdmin, getById);
    app.delete('/api/v1/category/deleteCategory/:id', requireSignIn, isAdmin, deleteCategory);

}
