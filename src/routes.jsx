import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  MapIcon,
  ShoppingCartIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications } from "@/pages/dashboard";

import Events from "./pages/dashboard/events";
import { SignIn, SignUp } from "./pages/auth";
import Regions from "./pages/dashboard/regions";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <BellIcon {...icon} />,
        name: "notifactions",
        path: "/notifactions",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "master data",
    layout: "dashboard",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "events",
        path: "/events",
        element: <Events />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "user",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <MapIcon {...icon} />,
        name: "regions",
        path: "/regions",
        element: <Regions />,
      },
    ],
  },

  {
    title: "report",
    layout: "dashboard",
    pages: [
      {
        icon: <TicketIcon {...icon} />,
        name: "order ticket",
        path: "/orderticket",
        element: <Events />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "order detail",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ArrowRightOnRectangleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <UserPlusIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
];

export default routes;
