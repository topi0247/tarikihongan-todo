import { gql, useMutation } from "@apollo/client";
import { Path } from "constants/routes";
import { Link } from "react-router-dom";

const postQuery = gql`
  mutation ($title: String!) {
    CreateTodo(title: $title) {
      success
      message
    }
  }
`;

export default function CreateTodo() {
  const [postTodo, { data, loading, error }] = useMutation(postQuery);

  if (error) {
    alert("エラーが発生しました");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    if (!title) {
      alert("タイトルを入力してください");
      return;
    }

    if (title.length > 30) {
      alert("タイトルは30文字以内で入力してください");
      return;
    }
    await postTodo({ variables: { title: title } });

    if (data?.createTodo.success) {
      alert("Todoを作成しました");
    }
    (e.target as HTMLFormElement).reset();
  };

  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-2xl text-center">Todo作成</h1>
      <section className="text-center">
        <p>あわよくば誰かにやってほしいTodo作成</p>
        <p className="text-xs">自分でやれ？一旦その話は置いておこう</p>
      </section>
      <section className="flex justify-center items-center w-full">
        {loading ? (
          <p>投稿中</p>
        ) : (
          <form
            className="border rounded mx-8 p-4 flex flex-col gap-3 w-full md:max-w-3xl"
            onSubmit={(e) => handleSubmit(e)}
          >
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
        )}
      </section>
      <div className="flex justify-center items-center">
        <Link to={Path.ROOT} className="link link-secondary">
          Home
        </Link>
      </div>
    </article>
  );
}
