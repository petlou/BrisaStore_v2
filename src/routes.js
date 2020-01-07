import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/sessions', SessionController.update);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/products', ProductController.index);
routes.get('/products/:modelo', ProductController.show);

routes.use(adminMiddleware);

routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

export default routes;