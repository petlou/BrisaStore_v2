import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { name, email, modelo, formatDate, quantCompra, valorFinalCompra } = data;

    console.log('A fila está executando!')
    console.log(`Nome do usuário ${name}`)
    console.log(`Email do usuário ${email}`)

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

    console.log('O email foi enviado!')
  }
}

export default new CancellationMail();