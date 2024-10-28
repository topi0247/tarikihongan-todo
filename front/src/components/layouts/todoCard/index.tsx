import { useRecoilValue } from "recoil";
import Arrow from "components/uis/arrow";
import { userState } from "status";
import { Todo } from "types";

export default function TodoCard({ todo }: { todo: Todo }) {
  const currentUser = useRecoilValue(userState);
  const isCreateUserDone = todo.done_users.some(
    (doneUser) => doneUser.id === currentUser.id
  );

  const handleRotateArrow = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    id: Number
  ) => {
    const arrow = document.getElementById(`arrow-${id}`);
    if (arrow) {
      const check = e.currentTarget.checked;
      arrow.style.transform = check ? "rotate(90deg)" : "rotate(0deg)";
    }
  };

  return (
    <div className="card bg-base-100 w-full shadow-xl border">
      <div className="card-body">
        <p>{todo.title}</p>
        {currentUser.id !== todo.created_user.id && (
          <p className="text-end text-sm">
            created by {todo.created_user.name} ... created{" "}
            <time dateTime={todo.created_at}>{todo.created_at}</time>
          </p>
        )}
        <div className="card-actions justify-start">
          {isCreateUserDone ? (
            <p className="btn btn-disabled">終わったよ！</p>
          ) : (
            <button className="btn btn-primary px-3 py-2">やったよ！</button>
          )}
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
