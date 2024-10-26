import { LoginButton } from "components/uis";
import TodoCard from "features/todoCard";

export default function Top() {
  const currentUser = null;
  return (
    <div className="my-8">
      <article className="flex justify-center items-center flex-col gap-3">
        <h1 className="text-2xl font-bold">誰かやってくれないかな～～～</h1>
        <p>を、リスト化できるTodoアプリ</p>
      </article>
      {!currentUser && (
        <article className="flex justify-center items-center my-4">
          <LoginButton />
        </article>
      )}
      <article>
        <div className="m-4">
          <TodoCard />
        </div>
      </article>
    </div>
  );
}
