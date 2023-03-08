
## ■概要

対象サイトのページの要素を別サイトに機械的に持ってきたいので、
<br>対象サイトの内容をローカル開発環境でスクレイピングして、
<br>スクレイピングで取得した各要素を別サイト用のテンプレートHTMLに
<br>はめこんでファイル出力するのをやってみた


## ■手順
* スクリプト(Ex.sample.js)のurlsのファイルパスやスクレイピングするURLのリストを作成する
* 色々ライブラリのインストール（もしかしたらNode.jsがver18以降じゃないとダメかも）

```
npm install
```

* スクレイピング先をローカル開発環境にしている場合はをブラウザでスクレイピングする
<br>　ローカル開発環境へアクセスできる状態にしておく

* nodeでスクリプト実行

```
#Ex.
node sample.js
```

* デフォルトやと_scrapingディレクトリ内にファイルパスで指定したディレクトリ階層で出力するはず


## ■参考URL

* ・Playwrightに入門してみた
<br>https://qiita.com/ushirokawa/items/9842b229407f4338a524

* ・Playwright 入門
<br>https://zenn.dev/optimisuke/articles/f38ea76006d3a6


* ・Playwright をスクレイピングに使ってみたら便利だったので紹介してみる
<br>https://qiita.com/nagoq/items/eec2a96952c964348506

