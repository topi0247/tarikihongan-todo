import { useRoutes } from "react-router-dom";
import { PRIVATE_ROUTES } from "./protected";
import { PUBLIC_ROUTES } from "./public";
import { Auth } from "features/auth";
import { userState } from "status";
import { useRecoilValue } from "recoil";

export const AppRoutes = () => {
  const currentUser = useRecoilValue(userState);
  const routes = currentUser ? PRIVATE_ROUTES : PUBLIC_ROUTES;
  const element = useRoutes([...routes]);

  return (
    <>
      <Auth />
      {element}
    </>
  );
};
