const Address = require("../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!userId || !address || !city || !pincode || !phone)
      throw new Error("Invalid data provided");

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      pincode,
      notes,
      phone
    })

    await newlyCreatedAddress.save();
    res.status(201).json({
      success: true,
      message: "Successfully saved the address",
      address: newlyCreatedAddress,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      throw new Error("UserId is required");

    const address = await Address.find({ userId });
    if (!address)
      throw new Error("Address Not Found");

    res.status(200).json({
      success: true,
      address: address,
      message: "Successfully get address data"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId)
      throw new Error("userId and addressID is required");

    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      formData,
      { new: true }
    )
    if (!address)
      throw new Error("Address Not Found");

    res.status(200).json({
      success: true,
      address: address,
      message: "Successfully Updated address data"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId)
      throw new Error("userId and addressID is required");

    const address = await Address.findOneAndDelete(
      { _id: addressId, userId }
    )
    if (!address)
      throw new Error("Address Not Found");

    res.status(200).json({
      success: true,
      message: "Successfully Deleted address data"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { addAddress, getAllAddress, editAddress, deleteAddress };