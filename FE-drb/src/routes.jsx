import {
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  CogIcon,
} from "@heroicons/react/24/solid";
import Home from "./pages/dashboard/home";
import SignIn from "./pages/auth/sign-in";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <CogIcon {...icon} />,
        name: "BỘ PHẬN MHE",
        path: "/home",
        element: <Home />,
      },
      
      // {
      //   path: "/sign-in",
      //   element: <SignIn />,
      // },
    ],
  },
];

export default routes;
