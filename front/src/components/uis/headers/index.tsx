import { Path } from "constants/routes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function Headers({ isPublic }: { isPublic: boolean }) {
  const [openMemu, setOpenMenu] = useState(false);
  const [openTheme, setOpenTheme] = useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    setOpenMenu(false);
    setOpenTheme(false);
    navigate(path);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={Path.ROOT} className="btn btn-ghost text-xl">
          他力本願Todo
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {isPublic && (
            <>
              <li className="hidden md:block">
                <button
                  type="button"
                  onClick={() => handleLinkClick(Path.CREATE_TODO)}
                >
                  Todoを作る
                </button>
              </li>
              <li className="hidden md:block">
                <button
                  type="button"
                  onClick={() => handleLinkClick(Path.MY_PAGE)}
                >
                  マイページ
                </button>
              </li>
              <li className="md:hidden">
                <details open={openMemu}>
                  <summary onClick={() => setOpenMenu(!openMemu)}>
                    メニュー
                  </summary>
                  <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 w-32">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLinkClick(Path.CREATE_TODO)}
                      >
                        Todoを作る
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLinkClick(Path.MY_PAGE)}
                      >
                        マイページ
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </>
          )}
          <li className="hidden">
            <details>
              <summary>カラーテーマ</summary>
              <ul className="bg-base-100 rounded-t-none p-2 flex flex-col gap-2 overflow-y-auto h-64">
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
  );
}
