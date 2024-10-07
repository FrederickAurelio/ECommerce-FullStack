import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser()).then((data) => {
      toast({
        title: data?.payload?.message,
      });
    });
  }
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <Button onClick={() => setOpen((o) => !o)} className="sm:block lg:hidden">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut /> Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
