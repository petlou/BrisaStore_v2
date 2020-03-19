export default async (req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method} - URL: ${req.url}`);
  console.count('Número de Requisições');

  next();

  console.timeEnd('Request');
};
