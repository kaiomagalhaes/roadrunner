const ObjectId = require('mongodb').ObjectID
const db = require('../db');

const SlackMessage = require('./SlackMessage').default;

const devToQATitle = 'development to qa'
const QAToMasterTitle = 'qa to master'

const collectionName = 'pullRequests';

class PullRequest {
  constructor(data) {
    this.branchName = data.branchName;
    this.link = data.link;
    this.ghId = data.ghId;
    this.repositoryName = data.repositoryName;
    this.title = data.title;
    this.draft = data.draft;
    this.state = data.state;
    this.closed = data.closed;
  }

  isDeployPR() {
    return this.title === devToQATitle || this.title === QAToMasterTitle
  }

  isValid() {
    return !this.draft && !this.isDeployPR(this.title.toLowerCase())
  }

  isClosed() {
    return !!this.closed;
  }

  async getMainSlackMessage() {
    this.mainSlackMessage = this.mainSlackMessage || await SlackMessage.findByPRId(this.id)
    return this.mainSlackMessage;
  }

  async create() {
    const collection = await db.getCollection(collectionName);

    const pr = await collection.insertOne(this.toJson());

    this.id = pr.ops[0]._id.toString()
  }

  async close() {
    this.closed = true;
    return await this.update();
  }

  async update() {
    const collection = await db.getCollection(collectionName);
    const json = this.toJson();
    delete json.id
    const objectID = new ObjectId(this.id)
    return await collection.updateOne({ _id: objectID }, { $set: json})
  }

  static async findById(id) {
    const objectID = new ObjectId(id)
    return await this.findBy({ _id: objectID })
  }

  static async findBy(query) {
    const collection = await db.getCollection(collectionName);
    const response = await collection.findOne(query);
    return new PullRequest(response)
  }

  async load() {
    const collection = await db.getCollection(collectionName);
    const pr = await collection.findOne({
      branchName: this.branchName,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
    });
    this.id = pr._id.toString()
    return this;
  }

  toJson() {
    return {
      branchName: this.branchName,
      link: this.link,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
      title: this.title,
      draft: this.draft,
      state: this.state,
      closed: this.closed,
    }
  }
};

exports.default = PullRequest;