export type Todo = {
  id: Number;
  title: String;
  created_user: User;
  created_at: string;
  done_users: Users[];
};

export type User = {
  id: Number;
  name: String;
  todos: Todo[] | null;
  done_todos: DoneTodo[] | null;
};

export type DoneTodo = {
  id: Number;
  user: User;
  todo: Todo;
};
