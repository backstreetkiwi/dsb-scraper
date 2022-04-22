const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage();
  await page.goto('https://dsbmobile.de/Login.aspx');
  await page.type('#txtUser', process.env.DSB_USERNAME);
  await page.type('#txtPass', process.env.DSB_PASSWORD);
  await page.click("input[type=submit]");
  await page.waitForNavigation();
  await page.waitFor(5000);

  const preview_element = await page.$("img[class='preview']");
  const preview_src = await (await preview_element.getProperty('src')).jsonValue()
  var regex = /f=(.*?)\/(.*?)\/preview.png/;
  var matched = regex.exec(preview_src);
  var doc_url = `https://dsbmobile.de/data/${matched[1]}/${matched[2]}/${matched[2]}.htm`;
  var timestamp = new Date().toISOString();
  await page.goto(doc_url);
  const html = await page.content();
  var regex_Stand = /Stand:\s([0-9]{2})\.([0-9]{2}).([0-9]{4})\s([0-9]{2}):([0-9]{2})/;
  var matched_Stand = regex_Stand.exec(html);
  const stand = `${matched_Stand[3]}-${matched_Stand[2]}-${matched_Stand[1]}--${matched_Stand[4]}-${matched_Stand[5]}`
  var regex_Tag = /<div\sclass=\"mon_title\">([0-9]{1,2})\.([0-9]{1,2}).([0-9]{4})/;
  var matched_Tag = regex_Tag.exec(html);
  const tag = `${matched_Tag[3]}-${matched_Tag[2]}-${matched_Tag[1]}`
  var pdf_path = `/output/${tag}---${stand}.pdf`;
  await page.pdf({path: pdf_path, format: 'a4' });

  await browser.close();
})();
