FROM node:18-alpine
WORKDIR /peergrader/
COPY public/ /peergrader/public
COPY src/ /peergrader/src
COPY package.json /peergrader/
RUN npm install
CMD ["npm", "start"]
