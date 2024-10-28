export type Todo = {
  id: Number;
  title: string;
  user: User;
  created_at: string;
  doneUsers: Users[];
};

export type User = {
  id: Number;
  name: string;
};

export type DoneTodo = {
  id: Number;
  user: User;
  todo: Todo;
};
