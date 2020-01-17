import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import StoreController from './app/controllers/StoreController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import logMiddleware from './app/middlewares/logRequest';

const routes = new Router();
const upload = multer(multerConfig);

routes.use(logMiddleware);

routes.post('/users', UserController.store);
routes.put('/sessions', SessionController.update);

routes.use(authMiddleware);

routes.get('/users', UserController.show);
routes.post('/avatar', upload.single('file'), UserController.storeUser);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/products', ProductController.index);
routes.get('/products/:modelo', ProductController.show);

routes.get('/store/:id', StoreController.show);
routes.put('/store/:id', StoreController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/files/:id', FileController.destroy);

routes.use(adminMiddleware);

routes.post('/products', ProductController.store);
routes.post('/files/products/:id', upload.single('file'), ProductController.storeProduct);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

routes.get('/providers', ProviderController.index);


export default routes;