import { Outlet } from "react-router-dom";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div>
      <div className="flex min-h-screen w-full">
        {/* Admin sidebar */}
        <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className="flex flex-1 flex-col">
          {/* Admin header */}
          <AdminHeader setOpen={setOpenSidebar} />
          <main className="flex flex-1 flex-col bg-muted/40 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;