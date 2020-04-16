FROM node:lts-stretch-slim
COPY . /MySite
WORKDIR /MySite
RUN npm install -g @angular/cli && \
    npm install && \
    ng build 
CMD ["node", "server.js"]