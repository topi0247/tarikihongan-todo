-- +migrate Up
create table if not exists users (
  id serial primary key,
  name varchar(255) not null,
  uid varchar(255) not null,
  provider varchar(255) not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
);
-- +migrate Down
drop table users;
