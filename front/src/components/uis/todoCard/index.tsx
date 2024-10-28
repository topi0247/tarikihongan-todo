import { Todo } from "types";

export default function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="card bg-base-100 w-full shadow-xl border">
      <div className="card-body">
        <p>{todo.title}</p>
        <p className="text-end text-sm">
          created by {todo.user.name} ... created{" "}
          <time dateTime={todo.created_at}>{todo.created_at}</time>
        </p>
        <div className="card-actions justify-start">
          <button className="btn btn-primary px-3 py-2">やったよ！</button>
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title flex justify-between items-center px-4">
              <span>やった人たち</span>
              <span>{todo.doneUsers.length}人</span>
            </div>
            <div className="collapse-content">
              <ul>
                {todo.doneUsers.map((user, index) => (
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
