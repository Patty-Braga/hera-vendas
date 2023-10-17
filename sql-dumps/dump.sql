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

INSERT INTO categorias (descricao)
VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE produtos (
	id serial primary key,
  descricao varchar(255),
  quantidade_estoque int,
  valor bigint,
  categoria_id int REFERENCES categorias (id)
);

CREATE TABLE clientes (
	id serial primary key,
  nome varchar(255),
  email varchar(255) unique,
  cpf varchar(20) unique,
  cep varchar(20),
  rua varchar(255),
  numero varchar(10),
  bairro varchar(255),
  cidade varchar(255),
  estado varchar(255)
);