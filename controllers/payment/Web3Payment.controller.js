import { implementWebhook } from "../../services/payment/Web3.service.js";

export let web3Webhook = async (req, res) => {
  const event = req.body;
  console.log("📩 Webhook Received from Alchemy:");
  const eventData = event.event.activity[0];
  await implementWebhook({
    fromAddress: eventData.fromAddress,
    transactionHash: eventData.hash,
    amount: eventData.value,
  });
  res.sendStatus(200);
};
