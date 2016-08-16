const casper = require('casper').create();
const fs = require('fs');
const x = require('casper').selectXPath;

const url = 'https://blogs.adobe.com/digitalmarketing/advertising/capturing-real-time-digital-behavior-programmatic-advertising-buys/';

casper.start(url);

casper.then(function() {
  this.echo("Start scraping data..");

  var title = casper.fetchText(x('//h1[@class="entry-title"]/text()'));

  var fullArticleText = casper.getElementsInfo(x('//div[@class="entry_content"]/p')).map(function (p) {
    return p.tag;
  }).join('');

  var excerpt = casper.fetchText(x('//meta[@name="twitter:description"]/@content'));

  var dateAndTime = casper.fetchText(x('//meta[@property="article:published_time"]/@content'));

  var dateAndTimeUpdated = casper.fetchText(x('//meta[@property="article:modified_time"]/@content'));

  var primeImage = casper.fetchText(x('//meta[@property="og:image"]/@content'));

  var otherImages;
  if (this.exists(x('//div[@class="entry_content"]//img'))) {
    otherImages = casper.getElementsInfo(x('//div[@class="entry_content"]//img'))
    .map(function (img) {
      return img.attributes.src;
    });
  }

  var author = casper.fetchText(x('//span[contains(@class, "author")]//a[@rel="author"]/text()'));

  var article = {
    url: url,
    title: title,
    excerpt: excerpt,
    dateAndTime: dateAndTime,
    dateAndTimeUpdated: dateAndTimeUpdated,
    fullArticleText: fullArticleText,
    primeImage: primeImage,
    otherImages: otherImages || [],
    author: author,
  };

  fs.write('./article.json', JSON.stringify(article, null, '  '), 'w');
});

casper.run(function () {
  this.echo('Exiting').exit();
});

casper.on('error', function(msg, backtrace) {
  this.echo(msg).exit();
});
