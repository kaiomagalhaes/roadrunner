import { SlackRepository, Reactji, Github } from '@services'
import { SlackMessage, PullRequest, Commit } from '@models';
import pullRequestParser from '../../parsers/pullRequestParser'

class ClosePullRequestFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const mainSlackMessage = await SlackMessage.findByPRId(pr.id);
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { channel } = repositoryData;

    await pr.close()

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

    const reactji = new Reactji(mainSlackMessage.ts, 'closed', channel, 'flow')
    reactji.react(true);
  };

  static async isFlow(json) {
    if (!json.action || json.action !== 'closed') {
      return false;
    };

    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    return pr && !pr.isClosed() && !pr.isDeployPR();
  };
}

export default ClosePullRequestFlow;