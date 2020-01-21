import * as Yup from 'yup';
import fs from 'fs';
import { resolve } from 'path';

import Product from '../models/Product';
import File from '../models/File';

class ProductController {
	async index(req, res) {
		let products = await Product.findAll({
			attributes: ['id', 'modelo', 'descricao', 'quantidade', 'preco',  'imagem_id'],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['name', 'path', 'url']
        }
      ]
		});

		if (products.length < 1) {
			return res.status(400).json({ error: 'NÃO HÁ PRODUTOS CADASTRADOS!' });
		}
		
		return res.json(products);
	}

	async show(req, res) {
		const products = await Product.findAll({
			where: { modelo: req.params.modelo },
			attributes: ['id', 'modelo', 'descricao', 'quantidade', 'preco',  'imagem_id'],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['name', 'path', 'url']
        }
      ]
		});
		
		if (products.length < 1) {
			return res.status(400).json({ error: 'NÃO HÁ PRODUTOS CADASTRADOS!' });
		}
		
		return res.json(products);
	}

	async store(req, res) {
		const schema = await Yup.object().shape({
			modelo: Yup.string().required(),
			descricao: Yup.string(),
			quantidade: Yup.number().integer(),
			preco: Yup.number(),
			imagem_url: Yup.string().url()
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'VERIFICAR CAMPOS!' });
		}

		const products = await Product.create(req.body);

		return res.json(products);
	}

	async storeImage(req, res) {
		const products = await Product.findByPk(req.params.id);

		const { originalname: name, filename: path } = req.file;

		const file = await File.create({
			name,
			path
		});

		let { imagem_id } = products;

		if (imagem_id) {
			const { path: oldPath } = await File.findByPk(imagem_id);
			const pathing = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', oldPath);

			await (await File.findByPk(imagem_id)).destroy();

			fs.unlink(pathing, (err) => {
				if (err) {
					console.error(err)
				}
				console.log('AVATAR ANTIGO EXCLUÍDO!')
			});
		};

		products.update({ imagem_id: file.id });

		return res.json({ file, products });
	}

	async update(req, res) {
		const schema = await Yup.object().shape({
			modelo: Yup.string(),
			descricao: Yup.string(),
			quantidade: Yup.number().integer(),
			preco: Yup.number(),
			imagem_url: Yup.string().url()
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'VERIFICAR CAMPOS!' });
		}

		const products = await Product.findByPk(req.params.id);

		const { quantidade } = products;

		if(req.body.quantidade) {
			const result = quantidade + req.body.quantidade;
			products.update({
				quantidade: result
			});
		}

		products.update({
			modelo: req.body.modelo,
			descricao: req.body.descricao,
			preco: req.body.preco
		});

		return res.json(products);
	}

	async destroy(req, res) {
		const products = await Product.findByPk(req.params.id);

		const { imagem_id } = products;
		await products.destroy();

		if (imagem_id) {
			const { path: oldPath } = await File.findByPk(imagem_id);
			const pathing = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', oldPath);

			await (await File.findByPk(imagem_id)).destroy();

			fs.unlink(pathing, (err) => {
				if (err) {
					console.error(err)
				}
				console.log('AVATAR ANTIGO EXCLUÍDO!')
			});
		};

		return res.status(200).json({ message: 'PRODUTO REMOVIDO!' });
	}
}

export default new ProductController();