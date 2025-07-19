export class PaymentStrategy {
  constructor() {}

  pay(data) {
    console.log("pay in the payment strategy");
  }

  refund(data) {
    console.log("refund in the payment strategy");
  }
  // i am running the docker file while the demonstrations outside my home :)
}
