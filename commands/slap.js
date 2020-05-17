const cheerio = require('cheerio');
const request = require('request');

module.exports = {
  name: 'slap',
  description:
    'Sends a random google image based on the search term which follows',
  execute(message, args) {
    let searchTerm = `amine slap gif` ;
    var options = {
      url: 'http://results.dogpile.com/serp?qc=images&q=' + searchTerm ,
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

      let embed = new Discord.RichEmbed()
            .setDescription(`**<@${message.author.id}> just slapped someone !**`)
            .setImage(urls[Math.floor(Math.random() * urls.length)
            .setColor(random);

        message.channel.send(embed);
        return;
    }
    });
  },
};
