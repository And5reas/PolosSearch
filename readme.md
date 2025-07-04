# 🧭 Polos Search

🇧🇷 Aplicação web para localizar polos educacionais com base na cidade pesquisada, mostrar a distância até o centro da cidade e exibir informações detalhadas do polo. É possível adicionar, editar e excluir polos por meio da interface.  
🇺🇸 Web application to locate educational hubs based on the searched city, show the distance from the city center, and display detailed information about the hub. Users can add, edit, and delete hubs through the interface.

---

## 📸 Demonstração / Demo

![Screenshot Main Page](./frontend/src/imgs/demo/screenshot.png)

---

## 🚀 Tecnologias / Technologies

- JavaScript, HTML & CSS
- PostgreSQL
- Express.js
- Apache2
- Bootstrap
- [Leaflet.js](https://leafletjs.com/)
- [API do IBGE](https://servicodados.ibge.gov.br/api/docs/) / IBGE API
- [OpenStreetMap Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/)

---

## ⚙️ Funcionalidades / Features

🇧🇷
- Buscar polos por cidade
- Calcular distância do centro urbano
- Visualizar informações do polo em mapa interativo
- Adicionar, editar e excluir polos

🇺🇸
- Search hubs by city
- Calculate distance from city center
- Display hub info on interactive map
- Add, edit, and delete hubs

---

## 📁 Como usar / How to Use

🇧🇷
### Pesquisando Polos

1. Use o campo **"Selecione uma cidade"** para buscar a cidade desejada.
2. Pressione **Enter** ou clique no botão à esquerda do campo de busca.
3. Pronto! Os polos serão exibidos no mapa com suas respectivas informações.

### Gerenciando os Polos

1. Acesse a aba **"Gerenciar Polos"** no topo da página.
2. Você verá uma lista com todos os polos cadastrados.
3. No canto superior direito, é possível **pesquisar** polos existentes ou adicionar um novo polo.
4. Cada card de polo possui botões para **editar** ou **excluir** o respectivo polo.

🇺🇸
### Searching for Hubs

1. Use the **"Select a city"** field to search for the desired location.
2. Press **Enter** or click the button to the left of the search field.
3. Done! The hubs will appear on the map with their respective details.

### Managing Hubs

1. Navigate to the **"Management"** tab at the top of the page.
2. A list of all registered hubs will be displayed.
3. In the top-right corner, you can search for existing hubs or add a new one.
4. Each hub card includes buttons to **edit** or **delete** that specific hub.

## ✅ Pré-requisitos / Prerequisites

- [Node.js (v18+)](https://nodejs.org/)
- [PostgreSQL (v13+)](https://www.postgresql.org/) com extensão [PostGIS](https://postgis.net/) habilitada
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Apache2](https://httpd.apache.org/)
- Git
- SO Linux 🐧 (Ubuntu Server 22.04 LTS)


## 📦 Instalação / Installation

### Configurando o FrontEnd no Apache2

```bash
# Clone o repositório / Clone the repository
git clone https://github.com/And5reas/PolosSearch
cd PolosSearch

# Mova o frontend / Move the frontend
mv ./frontend /var/www

# Duplique o arquivo 000-default.conf com o nome de frontend.conf
cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/frontend.conf

# Atualize o conteúdo do arquivo frontend.conf
nano /etc/apache2/sites-available/frontend.conf
```

Modifique o texto abaixo, **preenchendo as informações \<SeuEmail> e \<Domínio>**, após a modificação cole o conteúdo dentro do arquivo **"frontend.conf"**.

```txt
<VirtualHost *:80>
	ServerAdmin <SeuEmail>
	DocumentRoot /var/www/frontend
	ServerName <Domínio> (Se tiver caso não tenha, apenas coloque o IP do servidor)

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Feita alteração, execute o comando `a2ensite frontend.conf` no seu terminal. Agora já é possível acessar o seu frontend pelo navegador utilizando o endereço de IP do seu servidor ou o domínio, caso tenha configurado. Se por acaso você não conseguir acessar o frontend, tente colocar o arquivo `frontend` dentro de `/var/www/html` e acesse a aplicação pelo endereço `http://<ip-do-seus-servidor>/frontend`.

### Configurando o BackEnd no Docker

```bash
# Vá para o local onde você clonou o repositório / Go to the repository location

# Entre no diretório / Enter the directory
cd PolosSearch/backend

# Instale as dependencias do projeto
npm install

# Crie um arquivo .env
touch .env
```

Dentro do arquivo `.env`, adicione as seguintes linhas, substituindo o que for necessário. **Lembre-se de que o arquivo `.env` deve estar no diretório do projeto.** Esse arquivo irá fazer a conexão com seu banco de dados.

```dotenv
PGHOST=<ip-do-seu-banco>
PGUSER=<user>
PGPASSWORD=<password>
PGDATABASE=<database>
PGPORT=<port>
PORT=3000
```

Já no arquivo `docker-compose.yml`, adicione as seguintes linhas, substituindo o que for necessário

```docker
services:
  nodeapi:
    build: .
    container_name: nodeapi
    ports:
      - "3000:3000"
    environment:
      PGHOST: <host>
      PGUSER: <banco-user>
      PGPASSWORD: <banco-password>
      PGDATABASE: <database>
      PGPORT: <port>
      PORT: 3000
    depends_on:
      - postgres
    volumes:
      - .:/app
    working_dir: /app
    command: sh -c "npm install && node index.js"

volumes:
  pg_data:
```

Termine a configuração executando o seguinte comando para criar seu container no docker.

```bash
# Apenas execute estes comando para criar seu container
docker build -t geo-api .
docker run -it --rm -p 3000:3000 -v $PWD:/app geo-api
```

### Banco de dados

```sql
CREATE DATABASE geodados;

CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    status CHAR(1) NOT NULL,
    mantenedor TEXT,
    endereco TEXT,
    cep VARCHAR(20),
    cidade TEXT,
    estado CHAR(2),
    qt_alunos INT,
    razao_social TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOGRAPHY(Point, 4326) -- Usa tipo geográfico para suportar distâncias em metros
);

CREATE TABLE enderecos_deletados (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    status CHAR(1) NOT NULL,
    mantenedor TEXT,
    endereco TEXT,
    cep VARCHAR(20),
    cidade TEXT,
    estado CHAR(2),
    qt_alunos INT,
    razao_social TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOGRAPHY(Point, 4326), -- Usa tipo geográfico para suportar distâncias em metros
    deletado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION enderecos_proximos_geojson(
    lon DOUBLE PRECISION,
    lat DOUBLE PRECISION,
    raio_metros DOUBLE PRECISION DEFAULT 50000
)
RETURNS TEXT
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(
        jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geom)::jsonb,
          'properties', jsonb_build_object(
            'id', id,
            'nome', nome,
            'status', status,
            'mantenedor', mantenedor,
            'endereco', endereco,
            'cep', cep,
            'cidade', cidade,
            'estado', estado,
            'qt_alunos', qt_alunos,
            'latitude', latitude,
            'longitude', longitude,
            'distancia', ROUND(
              ST_Distance(geom, ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography)
            )
          )
        )
      )
    )::text
    FROM enderecos
    WHERE ST_DWithin(
      geom,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
      raio_metros
    )
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enderecos_geojson()
RETURNS TEXT
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'type', 'FeatureCollection',
      'features', jsonb_agg(
        jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geom)::jsonb,
          'properties', jsonb_build_object(
            'id', id,
            'nome', nome,
            'status', status,
            'mantenedor', mantenedor,
            'endereco', endereco,
            'cep', cep,
            'cidade', cidade,
            'estado', estado,
            'qt_alunos', qt_alunos,
            'latitude', latitude,
            'longitude', longitude
          )
        )
      )
    )::text
    FROM enderecos
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enderecos_proximos_polo(
  id_polo INT,
  raio_metros DOUBLE PRECISION DEFAULT 50000
)
RETURNS TEXT
AS $$
DECLARE
  geom_polo GEOGRAPHY;
BEGIN
  -- Obtém a geometria do polo informado
  SELECT geom::geography INTO geom_polo
  FROM enderecos
  WHERE id = id_polo
  LIMIT 1;

  IF geom_polo IS NULL THEN
      RAISE EXCEPTION 'Polo com ID "%" não encontrado.', id_polo;
  END IF;

  -- Retorna os endereços próximos em formato GeoJSON
  RETURN (
    SELECT jsonb_build_object(
    'type', 'FeatureCollection',
    'features', jsonb_agg(
        jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(e.geom)::jsonb,
          'properties', jsonb_build_object(
            'id', e.id,
            'nome', e.nome,
            'status', e.status,
            'mantenedor', e.mantenedor,
            'endereco', e.endereco,
            'cep', e.cep,
            'cidade', e.cidade,
            'estado', e.estado,
            'qt_alunos', e.qt_alunos,
            'latitude', e.latitude,
            'longitude', e.longitude,
            'distancia', ROUND(ST_Distance(e.geom::geography, geom_polo))
          )
        )
      )
    )::text
    FROM enderecos e
    WHERE ST_DWithin(e.geom::geography, geom_polo, raio_metros)
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION backup_before_delete_polo()
RETURNS TRIGGER AS $$
BEGIN
    -- Insere os dados deletados na tabela de backup
    INSERT INTO enderecos_deletados (nome, status, mantenedor, endereco , cep, cidade, estado, qt_alunos, razao_social, latitude , longitude, geom)
    VALUES (OLD.nome, OLD.status, OLD.mantenedor, OLD.endereco, OLD.cep, OLD.cidade, OLD.estado, OLD.qt_alunos, OLD.razao_social, OLD.latitude, OLD.longitude, OLD.geom);

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION adicionar_endereco(
    end_nome TEXT,
    end_status CHAR(1),
    end_mantenedor TEXT,
    end_endereco TEXT,
    end_cep VARCHAR(20),
    end_cidade TEXT,
    end_estado CHAR(2),
    end_qt_alunos INT,
    end_razao_social TEXT,
    end_latitude DOUBLE PRECISION,
    end_longitude DOUBLE PRECISION
)
RETURNS TEXT AS $$
DECLARE
  linhas_afetadas INT;
BEGIN
  INSERT INTO enderecos (nome, status, mantenedor, endereco , cep, cidade, estado, qt_alunos, razao_social, latitude , longitude, geom)
  VALUES
  (end_nome, end_status, end_mantenedor, end_endereco, end_cep, end_cidade, end_estado, end_qt_alunos, end_razao_social, end_latitude, end_longitude, ST_SetSRID(ST_MakePoint(end_longitude, end_latitude), 4326)::geography);

  GET DIAGNOSTICS linhas_afetadas = ROW_COUNT;

  IF linhas_afetadas > 0 THEN
    RETURN 'Registro adicionado com sucesso.';
  ELSE
    RETURN 'Não foi possível adicionar o registro.';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deletar_endereco(polo_id INT)
RETURNS TEXT AS $$
DECLARE
  linhas_afetadas INT;
BEGIN
  DELETE FROM enderecos WHERE id = polo_id;

  GET DIAGNOSTICS linhas_afetadas = ROW_COUNT;

  IF linhas_afetadas > 0 THEN
    RETURN 'Registro deletado com sucesso.';
  ELSE
    RETURN 'Registro não encontrado.';
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_endereco(
    end_id INT,
    end_nome TEXT,
    end_status CHAR(1),
    end_mantenedor TEXT,
    end_endereco TEXT,
    end_cep VARCHAR(20),
    end_cidade TEXT,
    end_estado CHAR(2),
    end_qt_alunos INT,
    end_razao_social TEXT,
    end_latitude DOUBLE PRECISION,
    end_longitude DOUBLE PRECISION
)
RETURNS VOID AS $$
BEGIN
  UPDATE enderecos
  SET
    nome = end_nome,
    status = end_status,
    mantenedor = end_mantenedor,
    endereco = end_endereco,
    cep = end_cep,
    cidade = end_cidade,
    estado = end_estado,
    qt_alunos = end_qt_alunos,
    razao_social = end_razao_social,
    latitude = end_latitude,
    longitude = end_longitude,
    geom = ST_SetSRID(ST_MakePoint(end_longitude, end_latitude), 4326)::geography
  WHERE id = end_id;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_backup_before_delete_polo
BEFORE DELETE ON enderecos
FOR EACH ROW
EXECUTE FUNCTION backup_before_delete_polo();
```


