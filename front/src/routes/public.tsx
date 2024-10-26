import { MainLayout } from "components/uis";
import { Path } from "constants/routes";
import NotFound from "features/notFound";
import Top from "features/top";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <MainLayout isPublic>
      <Outlet />
    </MainLayout>
  );
};

export const PUBLIC_ROUTES = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: Path.ROOT,
        element: <Top />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
