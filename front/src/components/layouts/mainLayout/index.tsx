import { Headers } from "components/layouts";
import { useRecoilValue } from "recoil";
import { userState } from "status";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useRecoilValue(userState);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shadow-xl mb-8">
        <Headers loginUserId={currentUser?.id} />
      </header>
      <main className="grow container m-auto">{children}</main>
      <footer className="flex justify-end items-center p-2">
        <p>©2024 とぴ</p>
      </footer>
    </div>
  );
}
