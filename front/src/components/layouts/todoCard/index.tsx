import { useRecoilValue } from "recoil";
import { Arrow, DeleteIcon, EditIcon } from "components/uis";
import { userState } from "status";
import { Todo, User } from "types";
import { Path } from "constants/routes";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const PostDone = gql`
  mutation ($todoId: ID!) {
    CreateDoneTodoUser(todoId: $todoId) {
      success
      message
    }
  }
`;

const DeleteDone = gql`
  mutation ($todoId: ID!) {
    DeleteDoneTodoUser(todoId: $todoId) {
      success
      message
    }
  }
`;

const UpdateTodo = gql`
  mutation ($id: ID!, $title: String!) {
    UpdateTodo(id: $id, title: $title) {
      title
    }
  }
`;

const DeleteTodo = gql`
  mutation ($id: ID!) {
    DeleteTodo(id: $id) {
      success
      message
    }
  }
`;

export default function TodoCard({ todo }: { todo: Todo }) {
  const currentUser = useRecoilValue(userState);
  const enableEdit = todo.created_user.id === currentUser.id;
  const isCreateUserDone = todo.done_users.some(
    (doneUser) => doneUser.id === currentUser.id
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isDone, setIsDone] = useState(isCreateUserDone);
  const [createDoneTodoUser] = useMutation(PostDone, {
    update(cache, { data }) {
      if (data?.CreateDoneTodoUser?.success) {
        cache.modify({
          id: cache.identify(todo),
          fields: {
            done_users(existingDoneUsers = []) {
              const newDoneUserRef = cache.writeFragment({
                data: currentUser,
                fragment: gql`
                  fragment NewDoneUser on User {
                    id
                    name
                  }
                `,
              });
              return [...existingDoneUsers, newDoneUserRef];
            },
          },
        });
        cache.modify({
          id: cache.identify({ __typename: "User", id: currentUser.id }),
          fields: {
            done_todos(existingDoneTodos = []) {
              const newDoneTodoRef = cache.writeFragment({
                data: todo,
                fragment: gql`
                  fragment NewDoneTodo on Todo {
                    id
                    name
                  }
                `,
              });
              return [...existingDoneTodos, newDoneTodoRef];
            },
          },
        });
      }
    },
  });

  const [deleteDoneTodoUser] = useMutation(DeleteDone, {
    update(cache, { data }) {
      if (data?.DeleteDoneTodoUser?.success) {
        cache.modify({
          id: cache.identify(todo),
          fields: {
            done_users(existingDoneUsers = [], { readField }) {
              return existingDoneUsers.filter(
                (doneUser: User) => readField("id", doneUser) !== currentUser.id
              );
            },
          },
        });
        cache.modify({
          id: cache.identify({ __typename: "User", id: currentUser.id }),
          fields: {
            done_todos(existingDoneTodos = [], { readField }) {
              return existingDoneTodos.filter(
                (doneTodo: Todo) => readField("id", doneTodo) !== todo.id
              );
            },
          },
        });
      }
    },
  });

  const [updateTodo] = useMutation(UpdateTodo, {
    update(cache, { data }) {
      if (data?.UpdateTodo?.title) {
        cache.modify({
          id: cache.identify(todo),
          fields: {
            title() {
              return data.UpdateTodo.title;
            },
          },
        });
      }
    },
  });

  const [deleteTodo] = useMutation(DeleteTodo, {
    update(cache, { data }) {
      if (data?.DeleteTodo?.success) {
        cache.evict({ id: cache.identify(todo) });
        cache.gc();
      }
    },
  });

  const handleRotateArrow = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    id: string
  ) => {
    const arrow = document.getElementById(`arrow-${id}`);
    if (arrow) {
      const check = e.currentTarget.checked;
      arrow.style.transform = check ? "rotate(90deg)" : "rotate(0deg)";
    }
  };

  const handleClickDone = async () => {
    await createDoneTodoUser({ variables: { todoId: todo.id } });
    setIsDone(true);
  };

  const handleClickDelete = async () => {
    await deleteDoneTodoUser({ variables: { todoId: todo.id } });
    setIsDone(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    if (title.length > 30) {
      alert("タイトルは30文字以内で入力してください");
      return;
    }

    await updateTodo({ variables: { id: todo.id, title: title } });
    form.reset();
    setIsEdit(false);
  };

  const handleDelete = async () => {
    const result = window.confirm("本当に削除しますか？");
    if (!result) return;

    await deleteTodo({ variables: { id: todo.id } });
  };

  return (
    <div className="card bg-base-100 w-full shadow-xl border">
      <div className="card-body">
        {enableEdit && isEdit ? (
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex justify-center items-center gap-2"
          >
            <input
              type="text"
              name="title"
              defaultValue={todo.title}
              className="input input-bordered w-full max-w-xs"
            />
            <button type="submit" className="btn btn-primary">
              更新
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => setIsEdit(false)}
            >
              戻る
            </button>
          </form>
        ) : (
          <div className="flex justify-center items-center">
            <p>{todo.title}</p>
            {enableEdit && (
              <>
                <button type="button" onClick={() => setIsEdit(true)}>
                  <EditIcon />
                </button>
                <button type="button" onClick={() => handleDelete()}>
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        )}
        <p className="text-end text-sm">
          created by{" "}
          <Link
            className="text-secondary"
            to={Path.USER_PAGE(todo.created_user.id)}
            state={{ id: todo.created_user.id }}
          >
            {todo.created_user.id === currentUser.id
              ? "あなた"
              : todo.created_user.name}
          </Link>{" "}
          ... created <time dateTime={todo.created_at}>{todo.created_at}</time>
        </p>
        <div className="card-actions justify-start">
          {currentUser.id ? (
            isDone ? (
              <button
                type="button"
                onClick={() => handleClickDelete()}
                className="btn btn-default"
              >
                やり直す！
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleClickDone()}
                className="btn btn-primary px-3 py-2"
              >
                やったよ！
              </button>
            )
          ) : null}
          <div className="collapse bg-base-200">
            <input
              type="checkbox"
              name={`doneUser-${todo.id}`}
              onClick={(e) => handleRotateArrow(e, todo.id)}
            />
            <div className="collapse-title flex justify-between items-center px-4">
              <div className="flex gap-2 justify-center items-center">
                <div id={`arrow-${todo.id}`}>
                  <Arrow size={24} />
                </div>
                <span>やった人たち</span>
              </div>
              <span>{todo.done_users.length}人</span>
            </div>
            <div className="collapse-content">
              <ul>
                {todo.done_users.map((user, index) => (
                  <li key={index}>
                    <Link
                      className="text-secondary"
                      to={Path.USER_PAGE(user.id)}
                      state={{ id: user.id }}
                    >
                      {user.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
