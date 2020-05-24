create table if not exists Progress (
    progressID int primary key auto_increment not null,
    daysSober int not null,
    userID int not null,
    foreign key (userID) references Users(id)
);

create table if not exists Marketplace (
    badgeID int primary key auto_increment not null,
    cost int not null
)

create table if not exists Badges (
    badgeID int not null,
    userID int not null,
    foreign key (badgeID) references Marketplace(badgeID),
    foreign key (userID) references Users(id)
)