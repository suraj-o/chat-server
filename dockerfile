FROM ubuntu as builder

RUN apt-get update && apt install curl -y
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get update  
RUN apt-get install nodejs -y

WORKDIR /home/app

COPY package*json .
COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm run build


FROM node:20 as Runner

WORKDIR /home

#SETTING ENV VARIABLES
ENV JWT_SECRET=Ahsyy3423423jfhdjh2
ENV DB_URL=mongodb://root:chatapp2024@localhost:27017/
ENV CLIENT_URL=http://localhost:3000
ENV PORT=8000
ENV KAFKA_USER_IP=0.0.0.0
ENV KAFKA_PORT=9092

# EXPOSING PORTS
EXPOSE 8000
EXPOSE 9092
EXPOSE 6379

COPY --from=builder /home/app/package*.json .
COPY --from=builder /home/app/node_modules node_modules
COPY --from=builder /home/app/dist dist/

#RUNNING COMMAND FOR CREATING TOPICS 
# RUN node dist/services/kafka-admin.js

CMD [ "npm","start" ]