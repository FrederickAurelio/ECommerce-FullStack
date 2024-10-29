// Create the order into our database
const paypal = require("../helpers/paypal");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Products = require("../models/Products");

function createPaymentJson(req) {
  return {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:3000/shop/paypal-return",
      cancel_url: "http://localhost:3000/shop/cancel",
    },
    transactions: [
      {
        item_list: {
          items: req.body.cartItems.map(item => ({
            name: item.title,
            sku: item.productId,
            price: item.price,
            currency: "USD",
            quantity: item.quantity,
          }))
        },
        amount: {
          currency: "USD",
          total: req.body.totalAmount.toFixed(2)
        },
        description: "description"
      }
    ]
  };
}

const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body;

    const create_payment_json = createPaymentJson(req);

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal Validation Error:", error.response);
        console.error("Error Details:", JSON.stringify(error.response.details, null, 2));
        throw new Error(`Error while creating PayPal payment: ${error.response.message}`);
      } else {
        const newlyCreatedOrder = new Order({
          userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId
        })

        await newlyCreatedOrder.save();
        await Cart.findByIdAndDelete(cartId);

        const approvalURL = paymentInfo.links.find(link => link.rel === "approval_url").href;
        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        })
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const continuePayment = async (req, res) => {
  try {
    const create_payment_json = createPaymentJson(req);
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal Validation Error:", error.response);
        console.error("Error Details:", JSON.stringify(error.response.details, null, 2));
        throw new Error(`Error while creating PayPal payment: ${error.response.message}`);
      } else {
        const approvalURL = paymentInfo.links.find(link => link.rel === "approval_url").href;
        res.status(201).json({
          success: true,
          approvalURL,
          orderId: req.body._id,
        })
      }
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// To check wether this order is successful or not by the paypal payment
const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order)
      throw new Error("Order cannot be foudn");

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    const getProductIds = order.cartItems.map(item => item.productId);
    const products = await Products.find({ "_id": { $in: getProductIds } });

    const foundProductIds = products.map(product => product._id.toString());
    const missingProductIds = getProductIds.filter(id => !foundProductIds.includes(id.toString()));

    if (missingProductIds.length > 0)
      throw new Error("Some products is missing: " + missingProductIds.join(", "))

    products.forEach(product =>
      product.totalStock -= order.cartItems.find(item => item.productId === product._id.toString()).quantity
    );

    await Promise.all(products.map(product => product.save()));

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
      order: order,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length)
      throw new Error("No orders found!");

    res.status(200).json({
      success: true,
      orders: orders,
      message: "successful fetch orders"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
      throw new Error("Order not found!");

    res.status(200).json({
      success: true,
      order: order,
      message: "successful fetch order"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { createOrder, continuePayment, capturePayment, getAllOrdersByUser, getOrderDetails };