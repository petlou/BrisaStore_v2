import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
//import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import logMiddleware from './app/middlewares/logRequest';

const routes = new Router();

routes.use(logMiddleware);

routes.post('/users', UserController.store);
routes.put('/sessions', SessionController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/products', ProductController.index);
routes.get('/products/:modelo', ProductController.show);
routes.get('/product/:id', ProductController.showOne);

//routes.post('/files', FileController.store);

routes.use(adminMiddleware);

routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

export default routes;