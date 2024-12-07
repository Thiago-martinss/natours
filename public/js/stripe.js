import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export const bookTour =  async tourId => {
    try {
    const session =  await axios(
        `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
} catch (err) {
    console.log(err);
    showAlert('error', 'An error occurred while trying to book the tour. Please try again later.');
}
}