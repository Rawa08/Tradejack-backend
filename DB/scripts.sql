drop table Clients, Contractors;

CREATE TABLE Clients
(
	id serial PRIMARY KEY,
	client_id varchar(120) not NULL,
	username varchar(120) NOT NULL,
	f_name varchar(120) not null,
	l_name varchar(120) not null,
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
	TS timestamptz default now(),
	last_login timestamp
);

CREATE TABLE Contractors
(
	id serial PRIMARY KEY,
	contractor_id varchar(120) NOT NULL,
	username varchar(120) NOT NULL,
	org_number varchar(120) NOT NULL,
    company_name varchar(120) NOT NULL,
    f_name varchar(120),
	l_name varchar(120),
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
	TS timestamptz default now(),
	last_login timestamptz
);

INSERT INTO Clients
(
	client_id,
	username,
	f_name,
	l_name,
	email,
	password,
	phone_num,street,
	postal_code,
	city)
VALUES
(123, 'RAWAclient', 'Rawa', 'Aref', 'rawa.aref@gmail.com', 'testingpastestingpastestingpastestingpastestingpastestingpas',
'0123456789', 'sillystreet', 15627, 'Stockholm');

select * from clients;

UPDATE Clients Set last_login = now() where client_id='123';
select * from clients;
