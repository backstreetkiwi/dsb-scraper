FROM node:latest

RUN apt-get update && apt-get install chromium -y

WORKDIR /app
COPY ["package.json", "dsb-scraper.js", "./"] 
RUN npm install  


#COPY . .# Strat the node application
CMD [ "node", "dsb-scraper.js" ]