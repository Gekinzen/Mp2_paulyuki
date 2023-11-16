/*P.Yuki Scraper and fetch miner data v1.020231116*/

const axios = require('axios');
const cheerio = require('cheerio'); /*used cheerio plugin*/
const fs = require('fs');
const path = require('path');

const fetchPage = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Unable to fetch the page ${url}: ${error.message}`);
  }
};

const getMetadata = (html) => {
  const $ = cheerio.load(html);

  const numLinks = $('a').length;
  const numImages = $('img').length;

  const metadata = {
    num_links: numLinks,
    images: numImages,
    last_fetch: new Date().toUTCString(),
  };

  return metadata;
};

const savePageWithMetadata = async (url) => {
  try {
    const pageContent = await fetchPage(url);
    const metadata = getMetadata(pageContent);

    const fileName = `${path.basename(url)}.html`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, pageContent);
    console.log(`Page saved successfully at ${filePath}`);

    console.log(`site: ${url}`);
    console.log(`num_links: ${metadata.num_links}`);
    console.log(`images: ${metadata.images}`);
    console.log(`last_fetch: ${metadata.last_fetch}`);
  } catch (error) {
    console.error(error.message);
  }
};

const url = process.argv[2];

if (!url) {
  console.error('Please provide a URL.');
  process.exit(1);
}

savePageWithMetadata(url);
