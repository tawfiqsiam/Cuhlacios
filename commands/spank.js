const cheerio = require('cheerio');
const request = require('request');

module.exports = {
  name: 'spank',
  description:
    'Send a random spank gif',
  execute(message, args) {
    let searchTerm = `amine spank gif` ;
    var options = {
      url: 'https://api.tenor.com/v1/search?q=' + searchTerm ,
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Chrome',
      },
    };

    request(options, (error, response, responseBody) => {
      if (error) return;
      $ = cheerio.load(responseBody);
      var links = $('.image a.link');
      var urls = new Array(links.length)
        .fill(0)
        .map((v, i) => links.eq(i).attr('href'));
      console.log(`${urls.length} results found.`);
      if (!urls.length) return;

      message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });
  },
};
