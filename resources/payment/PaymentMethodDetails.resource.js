import { PaymentMethodResource } from "./PaymentMethod.resource.js";

export let paymentMethodDetails = (paymentMethod) => {
  return {
    ...PaymentMethodResource(paymentMethod),
    credentials: paymentMethod.credentials,
  };
};
