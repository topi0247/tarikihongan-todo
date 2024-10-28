import { LoginButton } from "components/uis";
import TodoCard from "components/layouts/todoCard";
import { User } from "types";
import { useRecoilValue } from "recoil";
import { userState } from "status";

const Todos = Array.from({ length: 10 }, (_, i) => ({
  id: String(i),
  title: `Todo ${i}`,
  created_user: { id: String(i), name: `User ${i}` } as User,
  created_at: "2021/09/01",
  done_users: Array.from({ length: 3 }, (_, j) => ({
    id: String(j),
    name: `User ${j}`,
  })),
}));

export default function Top() {
  const currentUser = useRecoilValue(userState);

  return (
    <div className="my-8">
      <article className="flex justify-center items-center flex-col gap-3 my-8">
        <h1 className="text-2xl font-bold">誰かやってくれないかな～～～</h1>
        <p>を、リスト化できるTodoアプリ</p>
      </article>
      {!currentUser.id && (
        <article className="flex justify-center items-center my-8">
          <LoginButton />
        </article>
      )}
      <article className="md:grid md:grid-cols-2 gap-4">
        {Todos.map((todo) => (
          <div key={todo.id}>
            <TodoCard todo={todo} />
          </div>
        ))}
      </article>
    </div>
  );
}
