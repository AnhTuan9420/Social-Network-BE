const SlackNotify = require('slack-notify');

const slack = SlackNotify(process.env.MY_SLACK_WEBHOOK_URL);

const pushAlertToSlack = (message) => {
  slack.alert(message);
};

module.exports = {
  pushAlertToSlack,
};
