DROP TABLE HistoryItems;
DROP TABLE SubletRequests;
DROP TABLE SubletPosts;
DROP TABLE Rooms;
DROP TABLE SubleteeInfos;
DROP TABLE OriginalPrices;
DROP TABLE Residences;
DROP TABLE UnitTypes;
DROP TABLE Users;
DROP VIEW CompletePosts;

CREATE TABLE Users
(
	Email varchar(100),
	Password varchar(50) NOT NULL,
	PRIMARY KEY(Email)
);

CREATE TABLE UnitTypes
(
	UnitTypeName varchar(50),
	Kitchens number(1),
	Residents number(1),
	Bathrooms number(1),
	MoreInfoLink varchar(202),
	PRIMARY KEY(UnitTypeName)
);


CREATE TABLE Residences
(
	ResidenceName varchar(50),
	PictureLink varchar(202),
	MoreInfoLink varchar(202),
	PRIMARY KEY(ResidenceName)
);


CREATE TABLE OriginalPrices
(
	Residence varchar(50),
	UnitType varchar(50),
	YearRoundPrice number(5),
	PRIMARY KEY(Residence, UnitType),
	FOREIGN KEY(Residence) REFERENCES Residences
	    ON DELETE CASCADE,
	FOREIGN KEY(UnitType) REFERENCES UnitTypes
	    ON DELETE CASCADE
);

CREATE TABLE SubleteeInfos
(
	Email varchar(100),
	FirstName varchar(50) NOT NULL,
	LastName varchar(50) NOT NULL,
	ContactDescription varchar(300),
	PRIMARY KEY(Email),
	FOREIGN KEY(Email) REFERENCES Users
	    ON DELETE CASCADE
);

CREATE TABLE Rooms
(
	RoomNumber number(5),
	Building varchar(50),
	Residence varchar(50),
	Floor number(2) NOT NULL,
	GenderRestriction varchar(10) default 'none',
	UnitType varchar(50) NOT NULL,
	PRIMARY KEY(RoomNumber, Building, Residence),
	FOREIGN KEY(Residence) REFERENCES Residences
	    ON DELETE CASCADE,
	FOREIGN KEY(UnitType) REFERENCES UnitTypes
	    ON DELETE CASCADE
);

CREATE TABLE SubletPosts
(
	PostId number(10),
	Price number(5) NOT NULL,
	StartDate date NOT NULL,
	EndDate date NOT NULL,
	AdditionalInfo varchar(300),
	Status varchar(10) NOT NULL,
	Building varchar(50) NOT NULL,
	Residence varchar(50) NOT NULL,
	RoomNumber number(5) NOT NULL,
	SubletterEmail varchar(100) NOT NULL,
	PRIMARY KEY(PostId),
	FOREIGN KEY(RoomNumber, Building, Residence) REFERENCES Rooms
	    ON DELETE CASCADE,
	FOREIGN KEY(SubletterEmail) REFERENCES Users
	    ON DELETE CASCADE
);

CREATE TABLE SubletRequests
(
	Email varchar(100),
	PostId number(10),
	Status varchar(10) NOT NULL,
	Message varchar(300),
	PRIMARY KEY(Email, PostId),
	FOREIGN KEY(Email) REFERENCES SubleteeInfos
	    ON DELETE CASCADE,
	FOREIGN KEY(PostId) REFERENCES SubletPosts
        ON DELETE CASCADE
);

CREATE TABLE HistoryItems
(
	Email varchar(100),
	PostId number(10),
	CreatedDate timestamp NOT NULL,
	PRIMARY KEY(PostId),
	FOREIGN KEY(PostId) REFERENCES SubletPosts
	    ON DELETE CASCADE,
	FOREIGN KEY(Email) REFERENCES SubleteeInfos
	    ON DELETE SET NULL
);

CREATE VIEW CompletePosts AS
SELECT SubletPosts.PostId, SubletPosts.Price, SubletPosts.StartDate, SubletPosts.EndDate, SubletPosts.AdditionalInfo,
       SubletPosts.Status, SubletPosts.Building, SubletPosts.Residence, SubletPosts.RoomNumber, SubletPosts.SubletterEmail,
       Rooms.Floor, Rooms.GenderRestriction, Rooms.UnitType,
       Residences.MoreInfoLink AS ResidenceInfoLink, Residences.PictureLink AS ResidencePictureLink,
       UnitTypes.Kitchens, UnitTypes.Bathrooms, UnitTypes.Residents, UnitTypes.MoreInfoLink AS UnitTypeInfoLink,
       OriginalPrices.YearRoundPrice
FROM ((((SubletPosts
LEFT JOIN Rooms ON Rooms.Residence = SubletPosts.Residence AND Rooms.RoomNumber = SubletPosts.RoomNumber AND Rooms.Building = SubletPosts.Building)
LEFT JOIN Residences ON Residences.ResidenceName =  SubletPosts.Residence)
LEFT JOIN UnitTypes ON UnitTypes.UnitTypeName = Rooms.UnitType)
LEFT JOIN OriginalPrices ON OriginalPrices.Residence =  SubletPosts.Residence AND OriginalPrices.UnitType = Rooms.UnitType);


-- Add UBC year round residences

INSERT INTO Residences
VALUES ('Fraser Hall','http://vancouver.housing.ubc.ca/wp-content/uploads/2014/04/Res_detail_FH_2_1170x660.jpg','http://vancouver.housing.ubc.ca/residences/fraser-hall/');

INSERT INTO Residences
VALUES ('Marine Drive','http://vancouver.housing.ubc.ca/wp-content/uploads/2014/01/Res_detail_MD_exterior1_1170x660.jpg','http://vancouver.housing.ubc.ca/residences/marine-drive-residence/');

INSERT INTO Residences
VALUES ('Ponderosa Commons','http://vancouver.housing.ubc.ca/wp-content/uploads/2014/01/Res_detail_PC_exterior1_1170x660.jpg','http://vancouver.housing.ubc.ca/residences/ponderosa-commons/');

INSERT INTO Residences
VALUES ('Thunderbird','http://vancouver.housing.ubc.ca/wp-content/uploads/2014/01/Res_detail_TB_exterior2_1170x660.jpg','http://vancouver.housing.ubc.ca/residences/thunderbird/');

INSERT INTO Residences
VALUES ('Iona House','http://vancouver.housing.ubc.ca/wp-content/uploads/2016/03/Res_detail_IH_exterior_1170x660.jpg','http://vancouver.housing.ubc.ca/residences/iona-house/');

-- Add Unit types

INSERT INTO UnitTypes
VALUES ('One Bedroom',1, 1, 1,'http://vancouver.housing.ubc.ca/rooms/one-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('One Bedroom Large',1, 1, 1,'http://vancouver.housing.ubc.ca/rooms/one-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('Studio',1, 1, 1,'http://vancouver.housing.ubc.ca/rooms/studio-suite/');

INSERT INTO UnitTypes
VALUES ('Studio Small',1, 1, 1,'http://vancouver.housing.ubc.ca/rooms/studio-suite/');

INSERT INTO UnitTypes
VALUES ('Studio Large',1, 1, 1,'http://vancouver.housing.ubc.ca/rooms/studio-suite/');

INSERT INTO UnitTypes
VALUES ('Two Bedroom',1, 2, 1,'http://vancouver.housing.ubc.ca/rooms/two-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('Two Bedroom Large',1, 2, 1,'http://vancouver.housing.ubc.ca/rooms/two-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('Four Bedroom',1, 4, 2,'http://vancouver.housing.ubc.ca/rooms/four-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('Three Bedroom',1, 4, 2,'http://vancouver.housing.ubc.ca/rooms/three-bedroom-suite/');

INSERT INTO UnitTypes
VALUES ('Six Bedroom',1, 6, 2,'http://vancouver.housing.ubc.ca/rooms/six-bedroom/');

-- Add original Prices

INSERT INTO OriginalPrices
VALUES ('Fraser Hall','Six Bedroom',825);

INSERT INTO OriginalPrices
VALUES ('Fraser Hall','One Bedroom',1293);

INSERT INTO OriginalPrices
VALUES ('Marine Drive','Four Bedroom',917);

INSERT INTO OriginalPrices
VALUES ('Marine Drive','Three Bedroom',917);

INSERT INTO OriginalPrices
VALUES ('Marine Drive','Two Bedroom Large',1109);

INSERT INTO OriginalPrices
VALUES ('Marine Drive','Studio',1109);

INSERT INTO OriginalPrices
VALUES ('Marine Drive','Studio Large',1202);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Four Bedroom',924);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Two Bedroom',1114);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Two Bedroom Large',1138);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Studio Small',1092);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Studio',1120);

INSERT INTO OriginalPrices
VALUES ('Ponderosa Commons','Studio Large',1213);

INSERT INTO OriginalPrices
VALUES ('Thunderbird','Studio',1270);

INSERT INTO OriginalPrices
VALUES ('Thunderbird','One Bedroom',1299);

INSERT INTO OriginalPrices
VALUES ('Thunderbird','Two Bedroom',875);

INSERT INTO OriginalPrices
VALUES ('Thunderbird','Four Bedroom',808);

INSERT INTO OriginalPrices
VALUES ('Iona House','Studio',1036);

INSERT INTO OriginalPrices
VALUES ('Iona House','One Bedroom',1195);

INSERT INTO OriginalPrices
VALUES ('Iona House','One Bedroom Large',1355);

INSERT INTO OriginalPrices
VALUES ('Iona House','Two Bedroom',903);

INSERT INTO OriginalPrices
VALUES ('Iona House','Two Bedroom Large',1009);


-- Mock Data

INSERT INTO Users
VALUES ('gui.l.a@hotmail.com','ABC123');

INSERT INTO Users
VALUES ('1edmundoh@gmail.com','ABC123');

INSERT INTO Users
VALUES ('rahmanshamit@gmail.com','ABC123');

INSERT INTO Users
VALUES ('raov97@outlook.com','ABC123');


INSERT INTO Rooms
VALUES (0613,'Building 1','Marine Drive',6,'Male','One Bedroom');

INSERT INTO Rooms
VALUES (0614,'Building 2','Ponderosa Commons',6,'Male','Four Bedroom');

INSERT INTO Rooms
VALUES (0615,'Building 3','Iona House',6,'Male','Three Bedroom');

INSERT INTO Rooms
VALUES (0616,'Building 4','Fraser Hall',6,'Male','Two Bedroom Large');

INSERT INTO Rooms
VALUES (0617,'Building 5','Thunderbird',6,'Male','Two Bedroom Large');


INSERT INTO SubleteeInfos
VALUES ('gui.l.a@hotmail.com','Gui','La','Number: 69696969');

INSERT INTO SubleteeInfos
VALUES ('1edmundoh@gmail.com','Ed','Ho','Im from SF');

INSERT INTO SubleteeInfos
VALUES ('rahmanshamit@gmail.com','Shamit','R','Hi');

INSERT INTO SubleteeInfos
VALUES ('raov97@outlook.com','Rodolfo','Orozco','Coolest Kid in School');


INSERT INTO SubletPosts
VALUES (1,700,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Closed','Building 4','Fraser Hall',0616,'gui.l.a@hotmail.com');

INSERT INTO SubletPosts
VALUES (2,600,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 3','Iona House',0615,'1edmundoh@gmail.com');

INSERT INTO SubletPosts
VALUES (3,700,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Closed','Building 2','Ponderosa Commons',0614,'rahmanshamit@gmail.com');

INSERT INTO SubletPosts
VALUES (4,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 1','Marine Drive',0613,'raov97@outlook.com');


INSERT INTO SubletRequests
VALUES ('gui.l.a@hotmail.com',2,'Pending','Number: 69696969');

INSERT INTO SubletRequests
VALUES ('1edmundoh@gmail.com',1,'Accepted','Im from SF');

INSERT INTO SubletRequests
VALUES ('rahmanshamit@gmail.com',4,'Pending','Hi');

INSERT INTO SubletRequests
VALUES ('raov97@outlook.com',3,'Accepted','Coolest Kid in School');


INSERT INTO HistoryItems
VALUES ('gui.l.a@hotmail.com',1,TO_TIMESTAMP ('03.12.2010:12:34:24','DD.MM.YYYY:HH24:MI:SS'));

INSERT INTO HistoryItems
VALUES ('rahmanshamit@gmail.com',3,TO_TIMESTAMP ('03.12.2012:14:34:24','DD.MM.YYYY:HH24:MI:SS'));


INSERT INTO SubletPosts
VALUES (5,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 2','Ponderosa Commons',0613,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (6,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 1','Marine Drive',0613,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (7,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 5','Thunderbird',0617,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (8,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 2','Ponderosa Commons',0614,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (9,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 2','Ponderosa Commons',0614,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (10,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 3','Fraser Hall',0615,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (11,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 1','Marine Drive',0613,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (12,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 1','Marine Drive',0613,'raov97@outlook.com');


INSERT INTO SubletPosts
VALUES (13,800,TO_TIMESTAMP ('03.12.2027:12:34:24','DD.MM.YYYY:HH24:MI:SS'),TO_TIMESTAMP ('03.12.2028:12:34:24','DD.MM.YYYY:HH24:MI:SS'),'None','Open','Building 1','Marine Drive',0613,'raov97@outlook.com');




