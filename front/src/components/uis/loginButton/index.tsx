export default function LoginButton() {
  const handleClick = () => {
    window.location.href = `${process.env.REACT_APP_BACK_URL}/google`;
  };

  return (
    <button
      type="button"
      onClick={() => handleClick()}
      className="btn btn-primary"
    >
      ログイン
    </button>
  );
}
