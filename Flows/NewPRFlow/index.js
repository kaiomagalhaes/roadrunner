const DB = require('../../db');
const Slack = require('../../Slack');
const SlackRepository = require('../../SlackRepository');
const Utils = require('../../Utils');

const getContent = (json) => (
  {
    branchName: json.pull_request.head.ref,
    pullRequestLink: json.pull_request.html_url,
    pullRequestId: json.pull_request.number,
    repositoryName: json.repository.name,
  }
)

const savePRID = ({ pullRequestId, branchName, repositoryName }) => {
  const PRIDHash = Utils.getPRIDHash({
    branchName,
    repositoryName
  });

  DB.save(PRIDHash, pullRequestId)
}

const start = (json) => {
  const content = getContent(json);
  console.log('New PR content:', content)

  const { repositoryName, pullRequestLink, branchName, pullRequestId } = content;

  const repositoryData = SlackRepository.getRepositoryData(repositoryName)

  const { devGroup, channel } = repositoryData;

  const slackTSHash = Utils.getSlackTSHash({
    branchName,
    repositoryName,
    pullRequestId
  })
  console.log('New PR slack hash', slackTSHash)

  savePRID({ pullRequestId, repositoryName, branchName });

  const message = `${devGroup} :point_right:  please review this new PR: ${pullRequestLink}`;

  Slack.sendMessage({
    message,
    slackChannel: channel,
    callbackIdentifier: slackTSHash,
    callbackURL: 'http://gh-notifications.codelitt.dev/slack-callback'
  });
};

exports.start = start;