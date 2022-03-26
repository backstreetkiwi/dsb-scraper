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
  var pdf_path = `/output/${matched[1]}-${matched[2]}.pdf`;
  await page.goto(doc_url);
  await page.pdf({path: pdf_path, format: 'a4' });
  await browser.close();
})();
