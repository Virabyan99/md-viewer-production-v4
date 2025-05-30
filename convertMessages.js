const { set } = require('lodash');
const fs = require('fs');

function convertToNested(flatMessages) {
  return Object.entries(flatMessages).reduce((acc, [key, value]) => {
    set(acc, key, value);
    return acc;
  }, {});
}

// Convert each locale file
const locales = ['en', 'es', 'fr'];
locales.forEach((locale) => {
  const flatMessages = JSON.parse(fs.readFileSync(`./messages/${locale}.json`, 'utf8'));
  const nestedMessages = convertToNested(flatMessages);
  fs.writeFileSync(`./messages/${locale}.json`, JSON.stringify(nestedMessages, null, 2));
  console.log(`Conversion complete for ${locale}.json`);
});