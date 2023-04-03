import { Router } from 'express';
import cartDao from "../daos/dbManager/cartDao.js";

const router = Router();

//  API Cart Routes
router.get('/:id', async (req, res) => {
    try {
        const cart = await cartDao.getCartByID(req.params.id);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    try{
        const cart = await cartDao.createCart();
        res.json(cart);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})
router.post('/:id/product/:pid', async (req, res) => {
    try {
          const { id, pid } = req.params;
          const cartSelected = await cartDao.getCartByID({ _id: id });
      
          const newProduct = {
            product: pid,
            quantity: 1,
          };
      
          cartSelected.products.push(newProduct);
      
          const productAdded = await cartDao.findByIdAndUpdate(id , cartSelected.products );
          return res.status(200).json(cartSelected);

        } catch (err) 
        {
          console.log(err);
        }
})

router.put("/:cid", async (req, res) => {
    try {
        //TODO: revisar este put
        const { cid } = req.params;
        let body = req.body
        const cart = await cartDao.updateCart(cid, body)
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});


router.delete('/:id', async (req, res) => {
    try{
        const cart = await cartDao.deleteAllProducts(req.params.id);
        res.json(cart)
    }catch(err){
        res.status(500).json({ error: err.message })
    }
})
router.delete('/:id/product/:pid', async (req, res) => {
    try{
        const cart = await cartDao.deleteProduct(req.params.id, req.params.pid);
        res.json(cart)
    }catch(err){
        res.status(500).json({ error: err.message })
    }
})

export default router;