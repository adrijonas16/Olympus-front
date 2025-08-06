# Etapa 1: Construcción del proyecto
FROM node:18 AS build

# Crea el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero para usar la caché
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye la app para producción
RUN npm run build


# Etapa 2: Servir la app con Nginx
FROM nginx:alpine

# Copia el build generado al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto por donde Nginx sirve (por defecto es 80)
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
