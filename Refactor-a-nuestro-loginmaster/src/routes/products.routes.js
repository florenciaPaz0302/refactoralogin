import productDao from "../daos/dbManager/productDao.js";
import { Router } from 'express';

const router = Router();

router.get('/', async(req, res) => 
{
    let query = req.query.query || null
    let limit = parseInt(req.query.limit)
    let sort  = parseInt(req.query.sort)
    let page  = parseInt(req.query.page)
  
    try {
        let result = await productDao.getAll(limit, JSON.parse(query), sort, page)
        res.json(
          {
            status: 'success',
            payload: result,
          })
      } catch (error) {
        res.json({ message: 'Ha ocurrido un error, verifique bien los datos ingresados' })
      }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await productDao.getById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = await productDao.create(req.body);
        //res.json(product);
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const product = await productDao.update(req.params.id, req.body);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const product = await productDao.delete(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router;