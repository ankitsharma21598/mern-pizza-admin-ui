import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Categories from "./pages/Categories";
import LoginPage from "./pages/login/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;