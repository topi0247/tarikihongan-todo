import { useRoutes } from "react-router-dom";
import { PRIVATE_ROUTES } from "./protected";
import { PUBLIC_ROUTES } from "./public";

export const AppRoutes = () => {
  const currentUser = null;
  const routes = currentUser ? PRIVATE_ROUTES : PUBLIC_ROUTES;
  const element = useRoutes([...routes]);

  return <>{element}</>;
};
