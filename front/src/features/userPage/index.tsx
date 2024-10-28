import TodoCard from "components/layouts/todoCard";
import { useRecoilValue } from "recoil";
import { userState } from "status";
import { gql } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { Todo, User } from "types";

const Todos = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  title: `Todo ${i}`,
  created_user: { id: i, name: `User ${i}`, todos: [], done_todos: [] } as User,
  created_at: "2021/09/01",
  done_users: Array.from({ length: 3 }, (_, j) => ({
    id: j,
    name: `User ${j}`,
  })),
}));

const UserDataQuery = gql`
  query ($id: ID!) {
    User(id: $id) {
      id
      name
      todos
      done_todos
    }
  }
`;

export default function UserPage() {
  const currentUser = useRecoilValue(userState);
  const location = useLocation();
  const userId = location.state as Number;

  return (
    <>
      <article>
        <section className="flex flex-col gap-2">
          <p className="text-xl text-center">{currentUser.name}</p>
          {userId === currentUser.id && (
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
          )}
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
