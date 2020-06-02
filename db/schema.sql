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

insert into Users(email, passHash, username, firstName, lastName, bio, points, photoUrl) values ("root@root.com", "NA", "rootuser", "root", "user", "this is the root user", 0, "images/default_profile.png");

CREATE UNIQUE INDEX email_index
ON Users (email);

CREATE UNIQUE INDEX username_index
ON Users (username);

create table if not exists Progress (
    progressID int primary key auto_increment not null,
    daysSober int not null,
    dateLogged datetime default CURRENT_TIMESTAMP not null,
    userID bigint not null,
    foreign key (userID) references Users(id)
);

create table if not exists Marketplace (
    badgeID int primary key auto_increment not null,
    cost int not null,
    badgeName varchar(30) not null,
    badgeDescription varchar(255) not null,
    imgURL varchar(255) not null
);

insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (0, "New Member", "Add this to your profile for free! Think of this as a gift from us to you for having the courage to log onto our website.", "images/award.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (100, "One Day Sober", "Congratulations for your first step! It may not seem like much, but we are now your fans! It's time to Eradicate The Vape.", "images/one_day.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (600, "One Week Sober", "You're keeping up well! The first step towards getting somewhere is to decide that you are not going to stay where you are", "images/one_week.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (2300, "One Month Sober", "Congratulations! Making it through one month is no easy task. Persistence is key! You deserve this badge.", "images/one_month.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (15000, "Six Months Sober", "Wow! Great going champ! We're really proud to see your progress and happy that we could make a difference. Keep it going!", "images/six_months.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (18500, "One Year Sober", "Outstanding! Did you think you'd get this far when you started? Treat yourself because this is a huge milestone in your life.", "images/one_year.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (1500, "Vape-Tastic", "Enjoy having this cute peach on your profile. Be sure to make posts in the thread section to show it off!", "images/peach.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (10500, "Crown Juul", "An apple a day keeps the vape away! This badge will show users that you are no beginner! Be sure to carry it proudly.", "images/apple.png");
insert into Marketplace (cost, badgeName, badgeDescription, imgURL) values (25000, "Planet of the Vapes", "Ok so you're basically a pro at this. Others can definitely gonna notice this veteran badge in the threads section!", "images/heart.png");

create table if not exists Badges (
    badgeID int not null,
    userID bigint not null,
    foreign key (badgeID) references Marketplace(badgeID),
    foreign key (userID) references Users(id)
);

CREATE UNIQUE INDEX badge_index
ON Badges (badgeID, userID);

create table if not exists Threads (
    threadID int primary key auto_increment not null,
    threadName varchar(80) not null,
    threadDescription varchar(500),
    userWhoCreatedID bigint not null,
    timeCreated datetime not null,
    editedAt datetime not null,
    foreign key (userWhoCreatedID) references Users(id)
);

CREATE UNIQUE INDEX thread_index
ON Threads (threadName);

insert into Threads (threadName, threadDescription, userWhoCreatedID, timeCreated, editedAt) values ("General Thread", "This is the general thread where you can post anything", 1, NOW(), NOW());

create table if not exists Posts (
    postID int primary key auto_increment not null,
    threadID int not null,
    content varchar (1500) not null,
    userWhoCreatedID bigint not null,
    timeCreated datetime not null,
    editedAt datetime not null,
    foreign key (userWhoCreatedID) references Users(id),
    foreign key (threadID) references Threads(threadID)
);