import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const StripeCheckOutButton = ({ price }) => {
    const priceForStripe = price * 100;
    const publishableKey = 'pk_test_51GqOZ0Gxi8h3WIFqOIoNNPPgXOmLCD941IYNfbBV01pqc5OX9Lvrb2bYf2Z0XHJWECJO6bWjzqZrPMDhyeeUnkvE00CJIzzE7X';
    const onToken = async (token) => {
        console.log(token);
        const res = await axios.post('api/v1/products/checkout', {
            token,
            price
        });
        console.log(res.data);
        if(res.data.status === 'success') {
            alert('success');
        }
    }

    return (
        <StripeCheckout 
            label='Pay Now'
            name='Arriba Fashion & Beauty'
            billingAddress
            shippingAddress
            image='https://eskipaper.com/images/fashion-wallpaper-12.jpg'
            description={`Your total is $${price}`}
            amount={priceForStripe}
            panelLabel='Pay Now'
            token={onToken}
            stripeKey={publishableKey}
        />
    )
}

export default StripeCheckOutButton;