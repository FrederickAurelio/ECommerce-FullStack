import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/commmon/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { toast } from "@/hooks/use-toast";
import {
  createNewProduct,
  editProduct,
  getAllProducts,
} from "@/store/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
};

function AdminProducts() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const { productList, isLoading } = useSelector(
    (state) => state.adminProducts,
  );
  const dispatch = useDispatch();
  const [currentEditId, setCurrentEditId] = useState(null);

  function resetState() {
    setFormData(initialFormData);
    setImageFile(null);
    setCurrentEditId(null);
  }

  function handleAfterDispatch(data, successTitle) {
    if (data?.payload?.success) {
      // Fetching updated product list
      dispatch(getAllProducts());
      resetState();
      toast({
        title: successTitle,
      });
      setOpen(false);
    } else {
      console.log(data);
      toast({
        title: data?.payload?.message,
        variant: "destructive",
      });
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("brand", formData.brand);
    data.append("price", formData.price);
    data.append("salePrice", formData.salePrice);
    data.append("totalStock", formData.totalStock);
    data.append("imageFile", imageFile);

    if (!currentEditId) {
      dispatch(createNewProduct(data)).then((data) => {
        handleAfterDispatch(data, "Successfully add new product");
      });
    } else {
      dispatch(editProduct({ id: currentEditId, formData: data })).then(
        (data) => {
          handleAfterDispatch(data, "Successfully upadated a product");
        },
      );
    }
  }

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 flex justify-end">
        <Button
          onClick={() => {
            resetState();
            setOpen(true);
          }}
        >
          Add New Button
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((product) => (
              <AdminProductTile
                handleAfterDispatch={handleAfterDispatch}
                setCurrentEditId={setCurrentEditId}
                setImageFile={setImageFile}
                setFormData={setFormData}
                setOpen={setOpen}
                product={product}
              />
            ))
          : true}
      </div>
      <Sheet open={open} onOpenChange={() => setOpen(false)}>
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <CommonForm
              isLoading={isLoading}
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditId ? "Edit" : "Add"}
              onSubmit={onSubmit}
            >
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
              />
            </CommonForm>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
