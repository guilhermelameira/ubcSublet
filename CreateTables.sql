DROP TABLE HistoryItems;
DROP TABLE SubletRequests;
DROP TABLE SubletPosts;
DROP TABLE Rooms;
DROP TABLE SubleteeInfos;
DROP TABLE OriginalPrices;
DROP TABLE Residences;
DROP TABLE UnitTypes;
DROP TABLE Users;

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
	MoreInfoLink varchar(200),
	PRIMARY KEY(UnitTypeName)
);


CREATE TABLE Residences
(
	ResidenceName varchar(50),
	PictureLink varchar(200),
	MoreInfoLink varchar(200),
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
	RoomsNumber number(5),
	Building varchar(50),
	Residence varchar(50),
	Floor number(2) NOT NULL,
	GenderRestriction varchar(10) default 'none',
	UnitType varchar(50) NOT NULL,
	PRIMARY KEY(RoomsNumber, Building, Residence),
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
	RoomsNumber number(5) NOT NULL,
	SubletterEmail varchar(100) NOT NULL,
	PRIMARY KEY(PostId),
	FOREIGN KEY(RoomsNumber, Building, Residence) REFERENCES Rooms
	    ON DELETE CASCADE,
	FOREIGN KEY(SubletterEmail) REFERENCES Users
	    ON DELETE CASCADE,
	UNIQUE(SubletterEmail, StartDate, EndDate)
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
VALUES ('Marine Drive','Studio Large',1200);

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











