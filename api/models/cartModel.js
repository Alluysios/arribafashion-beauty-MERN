const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;