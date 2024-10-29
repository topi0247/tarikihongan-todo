export type Todo = {
  id: string;
  title: string;
  created_user: User;
  created_at: string;
  done_users: Users[];
};

export type User = {
  id: string;
  name: string;
  todos: Todo[] | null;
  done_todos: Todo[] | null;
};
