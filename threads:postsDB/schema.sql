create table if not exists Threads (
    threadID int primary key auto_increment not null,
    threadName varchar(80) not null,
    threadDescription varchar(255),
    userWhoCreatedID int not null,
    timeCreated datetime not null,
    editedAt datetime not null,
    foreign key (userWhoCreatedID) references Users(id)
)

create table if not exists Posts (
    postID int primary key auto_increment not null,
    threadID int not null,
    content varchar (500) not null,
    userWhoCreatedID int not null,
    timeCreated datetime not null,
    editedAt datetime not null,
    foreign key (userWhoCreatedID) references Users(id),
    foreign key (threadID) references Threads(threadID)
);