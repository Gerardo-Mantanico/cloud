# Establece la imagen base para el cliente de React
FROM node:18.17.1  as build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto del cliente de React al directorio de trabajo del contenedor
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto del cliente de React al directorio de trabajo del contenedor
COPY . .

# Compila el proyecto del cliente de React
RUN npm run build

# STAGE 2: run
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html