CREATE TABLE Clients
(
	id integer PRIMARY KEY,
	client_id varchar(30) not NULL,
	username varchar(120) NOT NULL,
	f_name varchar(120) not null,
	l_name varchar(120) not null,
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
	TS timestamp
);

CREATE TABLE Contractors
(
	id integer PRIMARY KEY,
	contractor_id varchar(30) NOT NULL,
	username varchar(120) NOT NULL,
  company_name varchar(120) NOT NULL,
  f_name varchar(120),
	l_name varchar(120),
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
	TS timestamp
);

CREATE TABLE Contractors
(
	id integer PRIMARY KEY,
	contractor_id varchar(30) NOT NULL,
	username varchar(120) NOT NULL,
  company_name varchar(120) NOT NULL,
  f_name varchar(120),
	l_name varchar(120),
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
	TS timestamp
);
