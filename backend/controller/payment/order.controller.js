import { Order } from "../../model/payment/order.model.js";


// Placeholder for UPI link/QR generation
const generateUpiLink = (orderId, amount, currency) => {
  // In a real scenario, this would call a payment gateway SDK.
  console.log(
    `Generating UPI link for Order ${orderId} with amount ${amount} ${currency}`
  );
  return `upi://pay?pa=merchant@upi&pn=MerchantName&am=${amount}&tid=${orderId}&cu=${currency}`;
};

export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }

    const newOrder = new Order({
      amount,
      currency: currency || "INR",
    });

    await newOrder.save();

    const upiLink = generateUpiLink(
      newOrder._id,
      newOrder.amount,
      newOrder.currency
    );

    res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
      paymentLink: upiLink,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const submitPaymentReference = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { userSubmittedRef } = req.body;

    if (!userSubmittedRef) {
      return res
        .status(400)
        .json({ message: "Payment reference number is required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Cannot submit reference for an order with status: ${order.status}`,
      });
    }

    order.userSubmittedRef = userSubmittedRef;
    await order.save();

    res.status(200).json({
      message: "Payment reference submitted successfully.",
      order: order,
    });
  } catch (error) {
    console.error("Error submitting payment reference:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controller to handle manual payment confirmation by admin