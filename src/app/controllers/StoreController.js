import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Product from '../models/Product';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class StoreController {
  async show(req, res) {
		const products = await Product.findByPk(req.params.id, {
			attributes: ['id', 'modelo', 'descricao', 'quantidade', 'preco',  'imagem_id'],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['name', 'path', 'url']
        }
      ]
		});
		
		return res.json(products);
  }
  
  async update(req, res) {
    const schema = await Yup.object().shape({
			quantidade: Yup.number().integer().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'DEFINIR QUANTIDADE!' });
    }
    
    const products = await Product.findByPk(req.params.id);

    const { modelo, quantidade, preco } = products;

    if(!(quantidade > 0)) {

      return res.json([products, { error: 'QUANTIDADE ESGOTADA!' }]);
    }

    const quantCompra = req.body.quantidade;

    if(quantCompra > quantidade || quantCompra <= 0) {
      return res.status(400)
      .json([{ quantidadeEmEstoque: quantidade },
      { error: 'VALOR INVÁLIDO INSERIDO NA QUANTIDADE!' }]);
    }

    const resultado = quantidade - quantCompra;

    products.update({ quantidade: resultado });

    const { name, email } = await User.findByPk(req.userId)

    const data = new Date();
    const formatDate = format(
        data,
        "'Dia' dd 'de' MMMM 'de' yyyy ', às' H:mm'h'",
        { locale: pt }
      );

    const notifications = await Notification.create({
      content: `Nova compra realizada por ${name}, no valor de: R$ ${
        (quantCompra * preco).toFixed(2)}`,
      date: formatDate,
    });

    console.log(`NOME USÁRIO ${ name }: EMAIL USUÁRIO ${ email }`)

    // await Mail.sendMail({
    //   to: `${ name } <${ email }>`,
    //   subject: 'Compra Realizada',
    //   template: 'compraRealizada',
    //   context: {
    //     user: name,
    //     modelo,
    //     date: formatDate,
    //     quantidade,
    //     preco
    //   }
    // });

		return res.json([products, notifications]);
  }
}

export default new StoreController();