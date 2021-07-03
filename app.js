const { App, AwsLambdaReceiver } = require('@slack/bolt');

require('dotenv').config()

// カスタムのレシーバーを初期化します
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// ボットトークンと、AWS Lambda に対応させたレシーバーを使ってアプリを初期化します。
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
  // `processBeforeResponse` オプションは、あらゆる FaaS 環境で必須です。
  // このオプションにより、Bolt フレームワークが `ack()` などでリクエストへの応答を返す前に
  // `app.message` などのメソッドが Slack からのリクエストを処理できるようになります。FaaS では
  // 応答を返した後にハンドラーがただちに終了してしまうため、このオプションの指定が重要になります。
  processBeforeResponse: true
});

// wifiと投稿するとWifi情報を返す
app.message('wifi', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    "attachments": [
      {
        "color": "#2eb886",
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Wifi情報1",
              "emoji": true
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": "*SSID 1:*\n<Example Password>"
              },
              {
                "type": "mrkdwn",
                "text": "*SSID 2:*\n<Example Password>"
              }
            ]
          }
        ],
      },
      {
        "color": "#2eb886",
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Wifi情報2",
              "emoji": true
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": "*<SSID>:*\n<Example Password>"
              }
            ]
          }
        ]
      }
    ]
  });
});

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
  const handler = await app.start();
  return handler(event, context, callback);
}
