import { cartModel } from "../../models/cart.model.js";

class CartDao {
    async createCart(){
        return await cartModel.create();
    }

    async getCartByID(id){
        return await cartModel.findOne({id});
    }

    async addProduct(cid, list){
        // Adds products to the cart, products have to be inside of an array to work
        list.forEach( async (data) => {
            let {product, quantity} = data;
            const isInCart = await cartModel.findOne({_id: cid, "products.product": product})

            console.log(isInCart)

            if(!isInCart){
                // product was not in the cart
                await cartModel.findOneAndUpdate({_id: cid}, {$push: {products: {product: product, quantity: quantity || 1 }}});
            }else{
                // update quantity if it's already in cart
                await cartModel.findOneAndUpdate({_id: cid, "products.product": product}, {$inc: {"products.$.quantity": quantity}})
            }
        })

        return await cartModel.find({_id: cid})
    }

    async addQuantity(cid, pid, qty){
        //modify quantity of a product
        return await cartModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": qty}});
    }

    async deleteProduct(cid, pid){
        return await cartModel.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}})
    }

    async deleteAllProducts(cid){
        return await cartModel.findOneAndReplace({_id: cid}, {products: []});
    }
}

export default new CartDao();