export default function TodoCard() {
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <p>だれかやってくれ～～</p>
        <div className="card-actions justify-start">
          <button className="btn btn-primary px-3 py-2">やったよ！</button>
          <div className="collapse bg-base-200">
            <input type="checkbox" name="my-accordion-1" defaultChecked />
            <div className="collapse-title flex justify-between items-center px-4">
              <span>やった人たち</span>
              <span>10人</span>
            </div>
            <div className="collapse-content">
              <p>hello</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
