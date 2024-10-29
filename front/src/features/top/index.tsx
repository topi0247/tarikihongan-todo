import { LoginButton } from "components/uis";
import { TodoCard } from "components/layouts";
import { Todo } from "types";
import { useRecoilValue } from "recoil";
import { userState } from "status";
import { gql, useQuery } from "@apollo/client";

const TodosQuery = gql`
  query {
    Todos {
      id
      title
      created_at
      created_user {
        id
        name
      }
      done_users {
        id
        name
      }
    }
  }
`;

export default function Top() {
  const currentUser = useRecoilValue(userState);
  const { data, loading, error } = useQuery<{ Todos: Todo[] }>(TodosQuery);

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
      {loading && <p>読み込み中</p>}
      {error && (
        <article className="flex justify-center items-center my-8">
          <p>エラーが発生しました</p>
        </article>
      )}
      {data && (
        <article className="md:grid md:grid-cols-2 gap-4 m-4">
          {data.Todos.map((todo) => (
            <div key={todo.id}>
              <TodoCard todo={todo} />
            </div>
          ))}
        </article>
      )}
    </div>
  );
}
