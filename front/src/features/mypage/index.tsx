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

export default function MyPage() {
  return (
    <>
      <article>
        <section className="flex flex-col gap-2">
          <p className="text-xl text-center">ユーザー名</p>
          <form className="flex gap-2 justify-center items-center">
            <div className="flex gap-2 w-auto justify-center items-center">
              <label htmlFor="name">名前</label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered w-2/3 max-w-xs"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              変更
            </button>
          </form>
        </section>
      </article>
      <article className="grid grid-cols-1 gap-3 m-4">
        <div className="collapse bg-base-200">
          <input type="checkbox" name="my-accordion-1" />
          <div className="collapse-title text-xl font-medium">作ったTodo</div>
          <div className="collapse-content">
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Todos.map((todo) => (
                <li key={todo.id}>
                  <TodoCard todo={todo} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="collapse bg-base-200">
          <input type="checkbox" name="my-accordion-1" />
          <div className="collapse-title text-xl font-medium">やったTodo</div>
          <div className="collapse-content">
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Todos.map((todo) => (
                <li key={todo.id}>
                  <TodoCard todo={todo} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
