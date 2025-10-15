create database ordersApp;

use ordersApp;

create table users (
	id int primary key auto_increment,
    name varchar(100) not null,
    email varchar(255) not null unique,
    password varchar(100) not null
);

create table products (
	id int primary key auto_increment,
    name varchar(100) not null unique,
    price decimal(4, 2) not null
);

create table orders (
	id int primary key auto_increment,
    user_id int not null,
    created_at datetime not null,
    total decimal(5, 2) null,
    foreign key (user_id) references users(id)
);

create table order_item (
	order_id int not null,
	product_id int not null,
    quantity int not null,
    subtotal decimal(5, 2) not null,
    primary key (order_id, product_id),
    foreign key (order_id) references orders(id),
    foreign key (product_id) references products(id)
);

insert into products (name, price) values ('pizza gigante peperoni', 4.75),
('hamburguresa pequenia', 2.25), ('hamburguesa mediana', 3.50), ('aceite', 2.30);

