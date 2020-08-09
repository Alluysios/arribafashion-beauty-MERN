const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Purchase product must belong to a Product']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Purchase product must belong to a user']
    },
    price: {
        type: Number,
        required: [true, 'Purchase product must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

historySchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'product',
        select: 'name price'
    })

    next();
});

const History = mongoose.model('History', historySchema);

module.exports = History;