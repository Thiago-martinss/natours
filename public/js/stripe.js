import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
    const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

    try {
      // 1) Get checkout session from API
      const session = await axios(
        `/api/v1/bookings/checkout-session/${tourId}`
      );
  
      // 2) Create checkout form + charge credit card
      /*
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id
      });
      */
      window.location.replace(session.data.session.url);
    } catch (err) {
      console.log(err);
      showAlert('error', err);
    }
  };
  



