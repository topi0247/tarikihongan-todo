
-- +migrate Up
create table if not exists done_todos (
  id serial primary key,
  user_id int references users(id) on delete cascade not null,
  todo_id int references todos(id) on delete cascade not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
create index done_todos_user_id_index on done_todos(user_id);
create index done_todos_id_index on done_todos(todo_id);

-- +migrate Down
drop table if exists done_todos;
