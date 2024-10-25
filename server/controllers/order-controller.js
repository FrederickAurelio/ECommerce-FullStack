// Create the order into our database
const paypal = require("../helpers/paypal");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body;

    const create_payment_json = {
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
            items: cartItems.map(item => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            }))
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2)
          },
          description: "description"
        }
      ]
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("PayPal Validation Error:", error.response);
        console.error("Error Details:", JSON.stringify(error.response.details, null, 2));
        throw new Error(`Error while creating PayPal payment: ${error.response.message}`);
      }

      else {
        const newlyCreatedOrder = new Order({
          userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId
        })

        await newlyCreatedOrder.save();
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
    res.json({
      success: false,
      message: error.message,
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

    const getCartId = order.cartId;

    await Cart.findByIdAndDelete(getCartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Confirmed",
      order: order,
    })

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { createOrder, capturePayment };