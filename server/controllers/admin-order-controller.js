const Order = require("../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find();
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

const getOrderDetailsForAdmin = async (req, res) => {
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus || orderStatus === "")
      throw new Error('Please select the order status');

    const order = await Order.findById(id);

    if (!order)
      throw new Error("Order not found!")

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order Status is updated to ${orderStatus} successfully`,
      order: order
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus };