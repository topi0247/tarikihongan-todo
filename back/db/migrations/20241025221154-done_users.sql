
-- +migrate Up
create table if not exists done_todo (
  id serial primary key,
  user_id int references users(id) on delete cascade not null,
  todo_id int references todos(id) on delete cascade not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);
create index done_users_user_id_index on done_todo(user_id);
create index done_users_todo_id_index on done_todo(todo_id);

-- +migrate Down
drop table if exists done_todo;
