# Setup

```bash
cp emv.templage .env
# set values as environments.

docker compose build
docker compose up -d

(Attach to Running Container)
```

# Inngest

https://www.inngest.com/docs/getting-started/nodejs-quick-start?guide=express

## enable live reload

```bash
npx tsx watch ./index.ts
```

## run inngest dev server

```bash
npx inngest-cli@latest dev
```
 
# SSHトンネリング + MySQL 接続 実験

Inngest パス: `/api/select-from-db`

リモートのDBテーブル sample_data から最大10件を取得するサンプル。

* DB接続経路は `本アプリ → SSHホスト → DB`。
* 本アプリから見えるDBポートは `127.0.0.1:13306`。
* SSHトンネリングを使うことで、リモートDBのポートがローカルで開いているように見える。
