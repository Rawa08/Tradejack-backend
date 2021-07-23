

CREATE TABLE Clients
(
	id serial PRIMARY KEY,
	client_id varchar(120) not NULL UNIQUE,
	username varchar(120) NOT NULL UNIQUE,
	profile_image varchar(300) default 'https://agiltec.se/wp-content/uploads/blank-profile-picture-973460_640.png',
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
	contractor_id varchar(120) NOT NULL UNIQUE,
	username varchar(120) NOT NULL UNIQUE,
	profile_image varchar(300) default 'https://agiltec.se/wp-content/uploads/blank-profile-picture-973460_640.png',
	org_number varchar(120) NOT NULL,
    company_name varchar(120) NOT NULL,
	email varchar(120) not null,
	password char(60) not null,
	phone_num varchar(20) not null,
	street varchar(120) not null,
	postal_code integer not null,
	city varchar(120) not null,
    f_name varchar(120),
	l_name varchar(120),
	TS timestamptz default now(),
	last_login timestamptz
);




CREATE TABLE IF NOT EXISTS Workorders (
	id serial PRIMARY KEY,
	author_id varchar(120) REFERENCES clients (client_id) ON DELETE CASCADE,
	title varchar(120) NOT NULL,
	description varchar(500) NOT NULL,
	street varchar(120) NOT NULL,
	postal_code integer NOT NULL,
	city varchar(120) NOT NULL,
	start_date varchar(120),
    end_date varchar(120),
	image_link text[],
	approved boolean default false,
  work_done boolean default false,
  ts timestamptz default now()
);



CREATE TABLE IF NOT EXISTS Workoffers (
	id serial PRIMARY KEY,
	order_id integer REFERENCES workorders (id) ON DELETE CASCADE,
	contractor_id varchar(120) REFERENCES contractors (contractor_id) ON DELETE CASCADE,
	message_field varchar(500),
 chosen boolean default false,
 ts timestamptz default now()
)

CREATE TABLE IF NOT EXISTS Admin(
	id serial PRIMARY KEY,
    name: varchar(20) not null,,
    password varchar(20) not null,
    last_login timestamptz
     ts timestamptz default now()
)



-- select * from clients;
--drop table Clients, Contractors;
-- UPDATE Clients Set last_login = now() where client_id='123';
-- select * from clients;

-- ALTER TABLE customers
-- ADD COLUMN phone VARCHAR;
