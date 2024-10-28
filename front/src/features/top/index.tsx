import { LoginButton } from "components/uis";
import TodoCard from "components/uis/todoCard";

const Todos = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  title: `Todo ${i}`,
  user: { id: i, name: `User ${i}` },
  created_at: "2021/09/01",
  doneUsers: Array.from({ length: 3 }, (_, j) => ({
    id: j,
    name: `User ${j}`,
  })),
}));

export default function Top() {
  const currentUser = null;
  return (
    <div className="my-8">
      <article className="flex justify-center items-center flex-col gap-3 my-4">
        <h1 className="text-2xl font-bold">誰かやってくれないかな～～～</h1>
        <p>を、リスト化できるTodoアプリ</p>
      </article>
      {!currentUser && (
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
