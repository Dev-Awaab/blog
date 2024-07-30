import  { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  const [open, setOpen] = useState<boolean>(false);
  return (
    <nav className=" ">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h4 className=" font-bold text-2xl tracking-wider">Blog</h4>
        </Link>

        <ul className="hidden  px-10 py-2 md:flex gap-x-6 text-zinc-500 text-sm ">
          {user ? (
            <>
              <Link to="/posts/new">
                <li className="cursor-pointer mt-1">Create a new Post</li>
              </Link>
              <li
                onClick={logout}
                className="cursor-pointer bg-black px-3 text-zinc-100 py-1 rounded "
              >
                Logout
              </li>
            </>
          ) : (
            <>
              <Link to="/login">
                <li className="cursor-pointer">Login</li>
              </Link>
              <Link to="/register">
                <li className="cursor-pointer">Register</li>
              </Link>
            </>
          )}
        </ul>
        <div className="border px-1 mr-4 rounded-md md:hidden">
          {open ? (
            <IoClose
              size={30}
              className="text-white"
              onClick={() => setOpen(false)}
            />
          ) : (
            <IoMdMenu
              size={30}
              className="text-white"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>
      {open && (
        <ul className="bg-phBlue2 border bor rounded-lg absolute right-2 w-[250px] top-[3.8rem] text-white flex flex-col items-center gap-y-4 py-2">
          <Link to="/auth/sign-up">
            <li className="cursor-pointer">Sign Up</li>
          </Link>
          <Link to="/auth/sign-in">
            <li className="cursor-pointer">Sign In</li>
          </Link>
          {user && (
            <Link to="/dashboard">
              <li className="cursor-pointer">Dashborad</li>
            </Link>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
