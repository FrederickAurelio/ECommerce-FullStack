import { useEffect, useState } from "react";
import CommonForm from "../commmon/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  getAllAdresses,
} from "@/store/address-slice";
import AddressCard from "./address-card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, currentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(e) {
    e.preventDefault();

    if (currentEditedId) {
      dispatch(
        editAddress({ userId: user?.id, addressId: currentEditedId, formData }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllAdresses(user?.id));
          setFormData(initialAddressFormData);
          setCurrentEditedId(null);
        }
        toast({
          title: data?.payload?.message,
          variant: data?.payload?.success ? "" : "destructive",
        });
      });
    } else {
      if (addressList.length >= 3) {
        toast({
          title: "You can add max 3 addresses",
          variant: "destructive",
        });
        return null;
      }
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        }),
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(getAllAdresses(user?.id));
          setFormData(initialAddressFormData);
        }
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      });
    }
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getAllAdresses(user?.id));
      }
      toast({
        title: data?.payload?.message,
        variant: data?.payload?.success ? "" : "destructive",
      });
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(getAllAdresses(user?.id));
  }, []);

  return (
    <Card>
      <div className="mb-5 grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 md:grid-cols-3">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddress) => (
              <AddressCard
                currentSelectedAddress={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                handleDeleteAddress={handleDeleteAddress}
                key={singleAddress._id}
                addressInfo={singleAddress}
                handleEditAddress={handleEditAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;
