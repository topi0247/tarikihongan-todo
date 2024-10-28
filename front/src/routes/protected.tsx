import { MainLayout } from "components/layouts";
import { Path } from "constants/routes";
import CreateTodo from "features/createTodo";
import MyPage from "features/mypage";
import NotFound from "features/notFound";
import Top from "features/top";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <MainLayout isPublic={true}>
      <Outlet />
    </MainLayout>
  );
};

export const PRIVATE_ROUTES = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: Path.ROOT,
        element: <Top />,
      },
      {
        path: Path.CREATE_TODO,
        element: <CreateTodo />,
      },
      {
        path: Path.MY_PAGE,
        element: <MyPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
