import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  IconButton,
  Menu,
  MenuHandler,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  BellIcon,

  ArrowUpOnSquareStackIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
  };

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };
  return (
    <Navbar
  color={fixedNavbar ? "white" : "transparent"}
  className={`rounded-xl transition-all ${
    fixedNavbar
      ? "fixed top-0 left-0 right-0 z-40 py-3 shadow-md shadow-blue-gray-500/5"
      : "px-0 py-1"
  }`}
  fullWidth
  blurred={fixedNavbar}
>
  <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center bg-[red] h-[80px]">
    <div className="">
      <img src="/img/logo1.jpg" alt="" className="w-[80%]" />
    </div>
    <div className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold">
      <p>BẢNG TIÊU CHUẨN CÔNG VIỆC</p>
    </div>
    <div className="flex items-center">
      {/* <IconButton
        variant="text"
        color="blue-gray"
        className="grid xl:hidden"
        onClick={handleLogout}
      >
        <ArrowUpOnSquareStackIcon className="h-5 w-5 text-white" />
      </IconButton> */}
      <Menu>
        <MenuHandler>
          <IconButton variant="text" color="blue-gray">
            <BellIcon className="h-5 w-5 text-white" />
          </IconButton>
        </MenuHandler>
      </Menu>
      <IconButton
        variant="text"
        color="blue-gray"
        onClick={() => setOpenConfigurator(dispatch, true)}
      >
        <Cog6ToothIcon className="h-5 w-5 text-white" />
      </IconButton>
      <IconButton
        variant="text"
        color="blue-gray"
        onClick={handleLogout}
      >
        <ArrowUpOnSquareStackIcon className="h-5 w-5 text-white" />
      </IconButton>
    </div>
  </div>
</Navbar>


  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
