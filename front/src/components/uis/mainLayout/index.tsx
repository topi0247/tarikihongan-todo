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
      <Headers isPublic={isPublic} />
      <div className="grow">{children}</div>
      <div className="flex justify-end items-center p-2">
        <p>©2024 とぴ</p>
      </div>
    </div>
  );
}
