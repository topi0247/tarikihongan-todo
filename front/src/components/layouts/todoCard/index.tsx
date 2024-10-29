import { useRecoilValue } from "recoil";
import Arrow from "components/uis/arrow";
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

export default function TodoCard({ todo }: { todo: Todo }) {
  const currentUser = useRecoilValue(userState);
  const isCreateUserDone = todo.done_users.some(
    (doneUser) => doneUser.id === currentUser.id
  );
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

  return (
    <div className="card bg-base-100 w-full shadow-xl border">
      <div className="card-body">
        <p>{todo.title}</p>
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
                    <span>{user.name}</span>
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
