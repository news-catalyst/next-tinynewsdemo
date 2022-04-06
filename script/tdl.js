var psl = require('psl');

var parsedSite = psl.parse('blackbygod.org');
console.log(
    `blackbygod.org>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );

var parsedSite = psl.parse('www.blackbygod.org');
console.log(
    `www.blackbygod.org>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );

var parsedSite = psl.parse('www.new.blackbygod.org');
console.log(
    `www.new.blackbygod.org>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );

var parsedSite = psl.parse('next-tinynewsdemo');
console.log(
    `next-tinynewsdemo>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );

var parsedSite = psl.parse('next-tinynewsdemo.tinynewsco.org');
console.log(
    `next-tinynewsdemo.tinynewsco.org>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );

var parsedSite = psl.parse('www.next-tinynewsdemo.tinynewsco.org');
console.log(
    `www.next-tinynewsdemo.tinynewsco.org>> parsed.tld: ${parsedSite.tld}, parsed.sld: ${parsedSite.sld}, parsed.domain: ${parsedSite.domain}, parsed.subdomain: ${parsedSite.subdomain}`
  );
