import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="m-6">
      <h1 className="text-3xl font-extrabold">Page does not exist</h1>
      <Button
        onClick={() => navigate("/auth/login")}
        className="mt-2 px-8 py-6 text-xl"
      >
        Return
      </Button>
    </div>
  );
}

export default NotFound;
