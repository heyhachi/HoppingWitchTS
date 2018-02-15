# hoppoing-witch-ts

**hoppoing-witch-ts**はTypeScriptでAkashicのサンプルデモ[HOPPING WITCH](https://akashic-games.github.io/asset/hoppingwitch.html)を書き直したものです。
Akashic自体の詳細は[公式サイト](https://akashic-games.github.io/)を確認してください。

## ライセンス
画像ファイルは[クリエイティブ・コモンズ 表示 2.1 日本 ライセンス](https://creativecommons.org/licenses/by/2.1/jp/)の下提供されています。
ソースコードはMIT Licenseの下で公開されています。詳しくは[LICENSE](./LICENSE)をご確認ください。

## 利用方法

 `hoppoing-witch-ts` を利用するにはNode.jsが必要です。

初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `hoppoing-witch-ts` を新しく生成するごとに必要です。

```sh
npm install
```

### ビルド方法

`hoppoing-witch-ts` はTypeScriptで書かれているため、以下のコマンドでJavaScriptファイルに変換する必要があります。

```sh
npm run build
```

`src` ディレクトリ以下のTypeScriptファイルがコンパイルされ、`script` ディレクトリ以下にJavaScriptファイルが生成されます。

`npm run build` は自動的に `akashic scan asset script` を実行するので、`game.json` の更新が行われます。

### 動作確認方法

以下のどちらかを実行後、ブラウザで `http://localhost:3000/game/` にアクセスすることでゲームを実行できます。

* `npm start`

* `npm install -g @akashic/akashic-sandbox` 後、 `akashic-sandbox .`

### アセットの更新方法

各種アセットを追加したい場合は、それぞれのアセットファイルを以下のディレクトリに格納します。

* 画像アセット: `image`
* スクリプトアセット: `script`
* テキストアセット: `text`
* オーディオアセット: `audio`

これらのアセットを追加・変更したあとに `npm run update` をすると、アセットの変更内容をもとに `game.json` を書き換えることができます。

### npm モジュールの追加・削除

`hoppoing-witch-ts` でnpmモジュールを利用する場合、このディレクトリで `akashic install <package_name>` することで npm モジュールを追加することができます。

また `akashic uninstall <package_name>` すると npm モジュールを削除することができます。

## エクスポート方法

`hoppoing-witch-ts` をエクスポートするときは以下のコマンドを利用します。

### htmlファイルのエクスポート

`npm run export-html` のコマンドを利用することで `game` ディレクトリにエクスポートすることができます。

`game/index.html` をブラウザで開くと単体動作させることができます。（現状akashic-tileがうまくパッケージングされずに動作しません）

### zipファイルのエクスポート

`npm run export-zip` のコマンドを利用することで `game.zip` という名前のzipファイルを出力できます。

## テスト方法

1. [TSLint](https://github.com/palantir/tslint "TSLint")を使ったLint
2. [Jasmine](http://jasmine.github.io "Jasmine")を使ったテスト

がそれぞれ実行されます。

```sh
npm test
```

テストコードのサンプルとして `spec/testSpec.js` を用意していますので参考にしてテストコードを記述して下さい。
