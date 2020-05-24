create table if not exists Users (
    id bigint not null auto_increment primary key,
    email varchar(80) not null,
    passHash char(60) not null,
    username varchar(80) not null,
    firstName varchar(64) not null,
    lastName varchar(128) not null,
    bio varchar(500),
    points int not null,
    photoUrl varchar(255) not null
);

insert into Users(email, passHash, username, firstName, lastName, bio, points, photoUrl) values ("root@root.com", "NA", "rootuser", "root", "user", "this is the root user", 0, "NA");

CREATE UNIQUE INDEX email_index
ON Users (email);

CREATE UNIQUE INDEX username_index
ON Users (username);