import { Router } from "express";
import cartDao from "../daos/dbManager/cartDao.js";
import productDao from "../daos/dbManager/productDao.js";
import __dirname from '../utils.js';

import isSession from '../middlewares/isSession.js';

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/products', async (req, res) => {
  
    let limit = parseInt(req.query.limit)
    let query = req.query.query || null
    let sort = parseInt(req.query.sort)
    let page = parseInt(req.query.page)
  
    try 
    {
      let result = await productDao.getAll(limit, JSON.parse(query), sort, page)
      res.render('products',{result})
    } catch (error) 
    {
      res.json({ message: 'Ha ocurrido un error al obtener los productos' })
    }
})

router.get('/products/:id', async (req, res) => {
    try 
    {
        const result = await productDao.getById(req.params.id)
        res.render('productDetails', { result })
    } 
    catch (error) 
    {
        res.json({ message: 'Ha ocurrido un error al obtener el producto' })
    }
})

router.get("/carts/:cid", async (req, res) => {

    try 
    {
        const { cid } = req.params;
        const cart = await cartDao.getCartByID(cid)
        res.render('cart', { cart })
    }
    catch (error) 
    {
        res.status(500).json({message:'Ha ocurrido un error al obtener el carrito'})
    }
})

router.get('/login', isSession, async (req, res) => {    
    res.render('login')
})

router.get('/register', isSession, async (req, res) => {    
    res.render('register')
})



export default router;