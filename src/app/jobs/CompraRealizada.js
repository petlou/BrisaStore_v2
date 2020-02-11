import Mail from '../../lib/Mail';

class CompraRealizada {
  get key() {
    return 'CompraRealizada';
  }

  async handle({ data }) {
    const { name, email, modelo, formatDate, quantCompra, valorFinalCompra } = data;

    await Mail.sendMail({
      to: `${ name } <${ email }>`,
      subject: 'Compra Realizada',
      template: 'compraRealizada',
      context: {
        user: name,
        modelo,
        date: formatDate,
        quantidade: quantCompra,
        preco: valorFinalCompra
      }
    });
  }
}

export default new CompraRealizada();