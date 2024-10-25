
-- +migrate Up
create table if not exists todos (
  id serial primary key,
  title varchar(255) not null,
  created_user_id integer references users(id) on delete cascade not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
);

-- +migrate Down
drop table if exists todos;
