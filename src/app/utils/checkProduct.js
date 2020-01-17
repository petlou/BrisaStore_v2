module.exports = function checkProduct(product) {
    console.log(`Check Product = ${product}`);
    if(!product) {
      return res.status(400).res.json({ error: 'PRODUTO NÃO CADASTRADO' });
    }

    return next();
  }