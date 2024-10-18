import { adminSidebarMenuItems } from "@/config";
import { ChartNoAxesCombined } from "lucide-react";
import { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

function MenuItems({ setOpen }) {
  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <NavLink
          onClick={() => setOpen(false)}
          to={menuItem.path}
          key={menuItem.id}
          className={({ isActive }) =>
            `${isActive ? "bg-muted text-foreground" : "text-muted-foreground"} flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xl hover:bg-muted hover:text-foreground`
          }
        >
          <menuItem.icon />
          <span>{menuItem.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b">
              <SheetTitle className="mb-4 mt-5 flex items-end gap-2">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <Link
          to="/admin/dashboard"
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </Link>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
