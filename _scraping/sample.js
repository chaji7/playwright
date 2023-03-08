const playwright = require('@playwright/test');
const fs = require('fs');
const path = require("path");
const { exit } = require('process');
const beautify = require('js-beautify').html;


(async () => {
  const urls = [
    // 出力するファイルパスとスクレイピングするURL
    //['./test/index.html',"http://test.example.php74/test/"],

  ];

    const browser = await playwright.chromium.launch({ 
        //headless: false // ヘッドレスモードをオフ
        headless: true,
    });
    const context = await browser.newContext();
    await context.route('**/*.js', (route, request) => {
      route.abort();
    });

    const page = await context.newPage();

    for (let [filePath,url] of urls) {
      await page.goto(url);

      // meta description
      const meta_description = await page.$eval("meta[name ='description']", el => el.outerHTML);
      
      // meta keywords
      const meta_keywords = await page.$eval("meta[name ='keywords']", el => el.outerHTML);

      // タイトル
      const title = await page.$eval('head > title', el => el.text);

      // ページ専用css(linkタグをカンマ区切りで複数)
      const linkTags = await page.$$eval('head > link', linkElements => linkElements.map(el => el.outerHTML.replace(/"/g, '""')));

      // ページ専用js(scriptタグをカンマ区切りで複数)
      const headScriptTags = await page.$$eval('head > script', headScriptElements => {
        return headScriptElements.filter(script => {
          return !script.src.includes('test.js'); // test.jsのスクリプトタグを除外
        }).map(script => script.outerHTML);
      });


      // コンテンツエリア
      let contents = await page.$eval('body > main', el => el.outerHTML);

      // テンプレートHTMLを読み込む
      let template = fs.readFileSync('../www/test/template.html', 'utf-8');

      // 各css、jsタグをカンマ区切りから改行に置換
      css_tags = '';
      linkTags.forEach((element, index) => {
        css_tags = css_tags + element.replace(/""/g, '"') + '\n\t';
      });
      head_js_tags = '';
      headScriptTags.forEach((element, index) => {
        head_js_tags = head_js_tags + element.replace(/""/g, '"') + '\n\t';
      });

      // ディレクトリ確認（なければ生成）
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // テンプレートHTMLを使って、スクレイピングしたデータに置換した状態で、ファイル出力
      var result = template
              .replace('@ページタイトル@', title)
              .replace('<meta name="description" content="@メタディスクリプション@">',meta_description)
              .replace('<meta name="keywords" content="@メタキーワード@">',meta_keywords)
              .replace('<!-- @CSS@ -->',css_tags)
              .replace('<!-- @JS@ -->',head_js_tags)
              .replace('@コンテンツエリア@',contents)

      // コード整形
      let beautify_options = {
        indent_size: 2,
      };
      result = beautify(result,beautify_options);

      fs.writeFileSync(filePath, result);
      

    }

    await browser.close();
})();