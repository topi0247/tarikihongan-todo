import { Headers } from "components/uis";

export default function MainLayout({
  isPublic,
  children,
}: {
  isPublic: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="shadow-xl mb-8">
        <Headers isPublic={isPublic} />
      </header>
      <main className="grow container m-auto">{children}</main>
      <footer className="flex justify-end items-center p-2">
        <p>©2024 とぴ</p>
      </footer>
    </div>
  );
}
