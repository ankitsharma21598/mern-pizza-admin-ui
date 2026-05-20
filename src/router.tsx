import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Dashbords from "./layouts/Dashbords";
import NonAuth from "./layouts/NonAuth";
import HomePage from "./pages/HomePage";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import Restaurants from "./pages/restaurants/Restaurants";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashbords />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/restaurants",
            element: <Restaurants />,
          },
        ],
      },

      {
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
