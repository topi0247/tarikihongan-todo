import { Path } from "constants/routes";
import { Link } from "react-router-dom";

export default function CreateTodo() {
  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-2xl text-center">Todo作成</h1>
      <section className="text-center">
        <p>あわよくば誰かにやってほしいTodo作成</p>
        <p className="text-xs">自分でやれ？一旦その話は置いておこう</p>
      </section>
      <section>
        <form className="border rounded mx-8 p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Todo名"
              className="p-2 rounded"
            />
          </div>
          <div className="flex justify-center items-center">
            <button type="submit" className="btn btn-primary">
              作成
            </button>
          </div>
        </form>
      </section>
      <div className="flex justify-center items-center">
        <Link to={Path.ROOT} className="link link-secondary">
          Home
        </Link>
      </div>
    </article>
  );
}
