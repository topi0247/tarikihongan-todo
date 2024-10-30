import { Path } from "constants/routes";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "status";
import { User } from "types";

const Themes = [
  "default",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "retro",
  "valentine",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "winter",
  "dim",
  "nord",
];

export default function Headers({ loginUserId }: { loginUserId: string }) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);

  const handleClick = async () => {
    window.localStorage.removeItem("_tarikihongan_token");
    setCurrentUser({ id: "", name: "" } as User);
    window.location.href = Path.ROOT;
  };

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to={Path.ROOT} className="btn btn-ghost text-xl">
            他力本願Todo
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {loginUserId && (
              <>
                <li className="hidden md:block">
                  <Link to={Path.ROOT}>Todo一覧</Link>
                </li>
                <li className="hidden md:block">
                  <Link to={Path.CREATE_TODO}>Todoを作る</Link>
                </li>
                <li className="hidden md:block">
                  <details>
                    <summary>マイページ</summary>
                    <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 w-32 z-50">
                      <li>
                        <Link
                          to={Path.USER_PAGE(String(loginUserId))}
                          state={{ id: loginUserId }}
                        >
                          {currentUser.name}さん
                        </Link>
                      </li>
                      <li className="hidden md:block">
                        <button type="button" onClick={() => handleClick()}>
                          ログアウト
                        </button>
                      </li>
                      <li>
                        <a
                          href="https://x.com/intent/tweet?text=誰か代わりにやってくれ！%0A新感覚Todoアプリ「他力本願Todo」でTodo管理！%0A%23他力本願Todo&url=https%3A%2F%2Ftarikihongan-todo.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xシェア
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
                <li className="md:hidden">
                  <details>
                    <summary>メニュー</summary>
                    <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 w-32 z-50">
                      <li>
                        <Link
                          to={Path.USER_PAGE(String(loginUserId))}
                          state={{ id: loginUserId }}
                        >
                          マイページ
                        </Link>
                      </li>
                      <li>
                        <Link to={Path.ROOT}>Todo一覧</Link>
                      </li>
                      <li>
                        <Link to={Path.CREATE_TODO}>Todoを作る</Link>
                      </li>
                      <li>
                        <button type="button" onClick={() => handleClick()}>
                          ログアウト
                        </button>
                      </li>
                      <li>
                        <a
                          href="https://x.com/intent/tweet?text=誰か代わりにやってくれ！%0A新感覚Todoアプリ「他力本願Todo」でTodo管理！%0A%23他力本願Todo&url=https%3A%2F%2Ftarikihongan-todo.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xシェア
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
              </>
            )}
            <li className="hidden md:block">
              <details>
                <summary>カラーテーマ</summary>
                <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 overflow-y-auto h-64 z-50">
                  {Themes.map((theme) => (
                    <li key={theme}>
                      <input
                        type="radio"
                        name="theme-buttons"
                        className={`btn theme-controller join-item ${theme}`}
                        aria-label={theme}
                        value={theme}
                      />
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
