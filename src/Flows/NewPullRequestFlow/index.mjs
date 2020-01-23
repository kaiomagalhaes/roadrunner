import Slack from '../../Slack.mjs'
import Github from '../../Github.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import Commit from '../../models/Commit.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'
import SlackReaction from '../../enums/SlackReaction.mjs';

class NewPullRequestFlow {
  static async start(json) {
    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { devGroup, channel } = repositoryData;

    await pr.create()

    const message = `${devGroup} :point_right:  please review this new PR: ${pr.link}`;

    const ts = await Slack.sendMessage({
      message,
      slackChannel: channel,
      prId: pr.id,
    });

    Slack.sendReaction({
      slackChannel: channel,
      reaction: SlackReaction.hourglass.simple(),
      messageTs: ts
    });

    const ghCommits = await Github.getCommits(pr.ghId, pr.owner, pr.repositoryName);

    ghCommits.forEach(ghCommit => {
      const { sha, commit } = ghCommit;
      const { author, message } = commit;
      const { date, email, name } = author;

      new Commit({
        prId: pr.id,
        sha,
        message,
        createdAt: (new Date(date)).getTime(),
        authorEmail: email,
        authorName: name,
      }).create();
    })
  };

  static isFlow(json) {
    if (json.action !== 'opened' && json.action !== 'ready_for_review') {
      return false;
    }

    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    return !pr.draft && !pr.isDeployPR()
  };
}

export default NewPullRequestFlow;