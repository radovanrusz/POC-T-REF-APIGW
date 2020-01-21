FROM node:8
ENV DEBIAN_FRONTEND=noninteractive
#RUN apt-get install -y tzdata

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#RUN dpkg-reconfigure -f noninteractive tzdata
RUN apt update && apt install

RUN /bin/bash -c 'source $HOME/.bashrc; date'
RUN mkdir -p /usr/src/apps/gateway
WORKDIR /usr/src/apps/gateway
COPY  package.json /usr/src/apps/gateway

RUN npm install
RUN npm update
RUN npm rebuild bcrypt --build-from-source

COPY . /usr/src/apps/gateway

ENV PATH /opt/IBM/node/bin:$PATH

RUN ls /usr/src/apps/gateway

EXPOSE 3000


RUN /bin/bash -c 'date'
RUN /bin/bash -c 'cat /etc/timezone'
CMD ["npm", "run", "start"]