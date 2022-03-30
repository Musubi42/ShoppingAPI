import StripeCheckout from 'react-stripe-checkout';
import {useState, useEffect } from "react";

const KEY = "pk_test_51K1efnL8joSK4Ha4xxVgJggIA6T7aIcb3v297BWuV1t3yCw0BXeb02HGK6qTV9AKtJmZbG7eKX87hjFnUFGZfRQ8008maZso3O";
const Pay = () => {
    const [stripeToken, setStripeToken] = useState(null)

    const onToken = (token) => {
        setStripeToken(token);
    }

    useEffect(() => {
        const makeRequest = (req, res) => {
            try {
                const res = await axios.post("http://localhost:3000/api/checkout/payment")
            }catch(err) {
                console.log(err);
            }
        }
    }, [stripeToken])
    return (
        <div 
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            >
                <StripeCheckout name="Musubi" image="../assets/truc.png" billingAdress hsippingAdress description="Your total is $20" amount={2000} token={onToken} stripeKey={KEY}>

                <button
                    style={{
                        border: 'none',
                        width: 120,
                        borderRadius: 5,
                        padding: "20px",
                        backgroundColor: 'black',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                    >
                    Pay Now
                    </button>
                </StripeCheckout>
                </div>
    );
};

export default Pay;