import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* Common Header */}
      <ShoppingHeader />
      <main className="flex w-full flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
