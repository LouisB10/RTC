Enum user_status {
  online
  offline
  away
  invisible
}

Table users {
  id            uuid         [pk, default: `gen_random_uuid()`]
  username      varchar(50)  [unique, not null]
  email         varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  avatar_url    varchar(255)
  status        user_status  [not null, default: 'offline']
  created_at    timestamp    [not null, default: `now()`]
}

Table servers {
  id          uuid         [pk, default: `gen_random_uuid()`]
  name        varchar(50)  [not null]
  owner_id    uuid         [not null, ref: > users.id]
  invite_code varchar(20)  [unique, not null]
  created_at  timestamp    [not null, default: `now()`]
}

Enum member_role {
  admin
  member
}

Table server_members {
  id         uuid         [pk, default: `gen_random_uuid()`]
  server_id  uuid         [not null, ref: > servers.id]
  user_id    uuid         [not null, ref: > users.id]
  role       member_role  [not null, default: 'member']
  joined_at  timestamp    [not null, default: `now()`]

  Indexes {
    (server_id, user_id) [unique]
    user_id
  }
}

Table server_bans {
  id         uuid        [pk, default: `gen_random_uuid()`]
  server_id  uuid        [not null, ref: > servers.id]
  user_id    uuid        [not null, ref: > users.id]
  expires_at timestamp
  created_at timestamp   [not null, default: `now()`]

  Indexes {
    (server_id, user_id) [unique]
  }
}

Table channels {
  id         uuid         [pk, default: `gen_random_uuid()`]
  server_id  uuid         [not null, ref: > servers.id]
  name       varchar(50)  [not null]
  created_at timestamp    [not null, default: `now()`]
}

Table messages {
  id         uuid       [pk, default: `gen_random_uuid()`]
  channel_id uuid       [not null, ref: > channels.id]
  author_id  uuid       [ref: > users.id]
  content    text
  edited_at  timestamp
  deleted_at timestamp
  created_at timestamp  [not null, default: `now()`]

  Indexes {
    (channel_id, created_at)
  }
}