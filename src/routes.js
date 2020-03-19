import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import FileController from './app/controllers/_FileController';
import Product_FileController from './app/controllers/_Product_FileController';
import User_FileController from './app/controllers/_User_FileController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import ProviderController from './app/controllers/ProviderController';
import StoreController from './app/controllers/StoreController';
import NotificationController from './app/controllers/NotificationController';
import ChatController from './app/controllers/ChatController';

import ValidateUserStore from './app/validators/userStore';
import ValidateUserUpdate from './app/validators/userUpdate';
import ValidateSessionStore from './app/validators/sessionStore';
import ValidateProductStore from './app/validators/productStore';
import ValidateProductUpdate from './app/validators/productUpdate';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import logMiddleware from './app/middlewares/logRequest';
import checkProduct from './app/middlewares/checkProduct';

const routes = new Router();
const upload = multer(multerConfig);

routes.use(logMiddleware);

routes.post('/users', ValidateUserStore, UserController.store);
routes.post('/sessions', ValidateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.get('/users-all', UserController.index);
routes.get('/users', UserController.show);
routes.put('/users', ValidateUserUpdate, UserController.update);
routes.post('/avatar', upload.single('file'), User_FileController.store);
routes.delete('/users', UserController.destroy);

routes.get('/products', ProductController.index);
routes.get('/products/:modelo', ProductController.show);

routes.get('/store/:id', checkProduct, StoreController.show);
routes.put('/store/:id', checkProduct, StoreController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/files/:id', FileController.destroy);

routes.get('/providers', ProviderController.index);

routes.get('/message-notifications', ChatController.notification_index);

routes.use(adminMiddleware);

routes.post('/products', ValidateProductStore, ProductController.store);
routes.post(
  '/image/:id',
  checkProduct,
  upload.single('file'),
  Product_FileController.store
);
routes.put(
  '/products/:id',
  checkProduct,
  ValidateProductUpdate,
  ProductController.update
);
routes.delete('/products/:id', checkProduct, ProductController.destroy);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
