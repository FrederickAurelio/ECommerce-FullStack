import { useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { deleteProduct } from "@/store/products-slice";
import { useState } from "react";

function AdminProductTile({
  setCurrentEditId,
  setFormData,
  setImageFile,
  setOpen,
  product,
  handleAfterDispatch,
}) {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  function handleEditClick() {
    setOpen(true);
    setFormData(product);
    setImageFile(product.imageUrl);
    setCurrentEditId(product._id);
  }
  function handleDeleteClick() {
    dispatch(deleteProduct(product._id)).then((data) => {
      handleAfterDispatch(data, "Successfully deleted " + product.title);
      setOpenDialog(false);
    });
  }
  return (
    <Card className="mx-auto w-full max-w-sm">
      <div>
        <div className="relative">
          <img
            className="h-[300px] w-full rounded-t-lg object-cover"
            src={product?.imageUrl}
            alt={product?.title}
          />
        </div>
        <CardContent>
          <h2 className="my-2 text-xl font-bold">{product?.title}</h2>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold">${product?.salePrice}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button onClick={handleEditClick}>Edit</Button>
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {product?.title}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild></AlertDialogAction>
                <Button variant="destructive" onClick={handleDeleteClick}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
