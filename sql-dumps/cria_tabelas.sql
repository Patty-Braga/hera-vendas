CREATE TABLE usuarios (
    id serial primary key,
  nome varchar(255),
  email varchar(255) unique,
  senha varchar(255)
);

CREATE TABLE categorias (
	id serial primary key,
  descricao varchar(255)
);