import 'source-map-support/register';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import axios from 'axios';
// import wtf from 'wtf_wikipedia';
const wtf = require('wtf_wikipedia')


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.listen(4000);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/search', async (req, res) => {
  const { term } = req.query;
  let url = 'https://en.wikipedia.org/w/api.php';

  const params = {
    action: 'query',
    list: 'search',
    srsearch: term,
    format: 'json'
  };

  url = url + '?origin=*';
  Object.keys(params).forEach(function (key) { url += '&' + key + '=' + params[key]; });
  try {
    const searchResponse: any = await axios.get(url);
    const titlesObj = searchResponse.data.query.search;
    const titles = titlesObj.map((titleObj) =>
      titleObj.title.replace(/\s+/g, '_')
    );
    const fistTitle = titles[0];
    const content = await getContentPage(titles.join('|'));
    res.send(`<h3> Found: </h3> <br> <strong>${fistTitle}</strong> with <br> ${content!.join('/n')}`);
  } catch (err) {
    console.log(err);
    res.send(`searching ${term} failed`);
  }
});

async function getContentPage(titles) {
  const url = 'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles,
      format: 'json',
      prop: 'revisions',
      rvprop: 'content',
    });

  try {
    const response: any = await axios.get(url);
    const getData = Object.values(response.data.query.pages).map((page: any) => wtf(page.revisions[0]['*']).text() + '<br><br><br>');
    return getData;
  } catch (e) {
    console.error(e);
  }
}