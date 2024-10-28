import TodoCard from "components/layouts/todoCard";
import { useRecoilState } from "recoil";
import { userState } from "status";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { Todo, User } from "types";
import { useEffect, useState } from "react";

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

const UpdateMutation = gql`
  mutation ($name: String!) {
    UpdateUser(name: $name) {
      success
      message
    }
  }
`;

type State = {
  id: string;
};

export default function UserPage() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [newUserName, setNewUserName] = useState("");
  const location = useLocation();
  const userId = (location.state as State).id;
  // const {
  //   data,
  //   loading,
  //   error: userError,
  // } = useQuery(UserDataQuery, { variables: { id: userId } });
  const [
    updateUser,
    { data: updatedData, loading: updatedLoading, error: updatedError },
  ] = useMutation(UpdateMutation);

  useEffect(() => {
    if (updatedError) {
      alert("エラーが発生しました");
    }
  }, [updatedError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUserName) {
      alert("名前を入力してください");
      return;
    }

    await updateUser({ variables: { name: newUserName } });

    setCurrentUser({ ...currentUser, name: newUserName });
    setNewUserName("");
  };

  return (
    <>
      <article>
        <section className="flex flex-col gap-2">
          <p className="text-xl text-center">{currentUser.name}</p>
          {userId === currentUser.id && (
            <form
              className="flex gap-2 justify-center items-center"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className="flex gap-2 w-auto justify-center items-center">
                <label htmlFor="name">名前</label>
                <input
                  name="name"
                  type="text"
                  placeholder="name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="input input-bordered w-2/3 max-w-xs"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={updatedLoading}
              >
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
