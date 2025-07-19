// for singular payment method
export const PaymentMethodResource = (paymentMethod) => {
  return {
    id: paymentMethod._id,
    type: paymentMethod.type,
    is_primary: paymentMethod.isPrimary,
    created_at: paymentMethod.created_at,
  };
};

// for collection of payment method
export const PaymentMethodCollection = (paymentMethods) => {
  return paymentMethods.map((pm) => PaymentMethodResource(pm));
};
