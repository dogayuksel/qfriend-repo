FROM mhart/alpine-node

ENV HOME=/home/app
RUN apk add --update build-base git python python-dev

COPY package.json $HOME/este-qfriend/
RUN cd $HOME/este-qfriend && npm install

RUN apk del build-base python python-dev
RUN rm -rf /etc/ssl /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

ENV PORT=3000 NODE_ENV=production
COPY . $HOME/este-qfriend/
WORKDIR $HOME/este-qfriend/

CMD ["npm", "build"]