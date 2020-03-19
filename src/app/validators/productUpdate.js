import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = await Yup.object().shape({
      modelo: Yup.string(),
      descricao: Yup.string(),
      quantidade: Yup.number().integer(),
      preco: Yup.number(),
      imagem_url: Yup.string().url(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'VERIFICAR CAMPOS!', messages: err.inner });
  }
};
