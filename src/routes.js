import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import StoreController from './app/controllers/StoreController';
import NotificationController from './app/controllers/NotificationController';
import MessageController from './app/controllers/MessageController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
// import logMiddleware from './app/middlewares/logRequest';
import checkProduct from './app/middlewares/checkProduct';

const routes = new Router();
const upload = multer(multerConfig);

// routes.use(logMiddleware);

routes.post('/users', UserController.store);
routes.put('/sessions', SessionController.update);

routes.use(authMiddleware);

routes.get('/users', UserController.show);
routes.post('/avatar', upload.single('file'), UserController.storeAvatar);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.destroy);

routes.get('/products', ProductController.index);
routes.get('/products/:modelo', ProductController.show);

routes.get('/store/:id', checkProduct, StoreController.show);
routes.put('/store/:id', checkProduct, StoreController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/files/:id', FileController.destroy);

routes.post('/messages', MessageController.store);
routes.get('/messages/:chatId', MessageController.show);
routes.post('/messages/:chatId', MessageController.answer);
routes.put('/messages/:_id', MessageController.update);

routes.use(adminMiddleware);

routes.post('/products', ProductController.store);
routes.post(
  '/image/:id',
  checkProduct,
  upload.single('file'),
  ProductController.storeImage
);
routes.put('/products/:id', checkProduct, ProductController.update);
routes.delete('/products/:id', checkProduct, ProductController.destroy);

routes.get('/providers', ProviderController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
