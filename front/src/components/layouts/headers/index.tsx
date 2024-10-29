import { Path } from "constants/routes";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "status";

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
                  <Link
                    to={Path.USER_PAGE(String(loginUserId))}
                    state={{ id: loginUserId }}
                  >
                    マイページ
                  </Link>
                </li>
                <li className="hidden md:block">
                  <a
                    href="https://twitter.com/intent/tweet?text=誰か代わりにやってくれ！\n新感覚Todoアプリ「他力本願Todo」でTodo管理！¥n#他力本願Todo&url=https://tarikihongan-todo.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xシェア
                  </a>
                </li>
                <li className="md:hidden">
                  <details>
                    <summary>メニュー</summary>
                    <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 w-32">
                      <li className="hidden md:block">
                        <Link to={Path.ROOT}>Todo一覧</Link>
                      </li>
                      <li>
                        <Link to={Path.CREATE_TODO}>Todoを作る</Link>
                      </li>
                      <li>
                        <Link to={Path.USER_PAGE(String(loginUserId))}>
                          マイページ
                        </Link>
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
