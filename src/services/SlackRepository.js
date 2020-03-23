const repositoriesIdentifiers = {
  'roadrunner': {
    devGroup: '@engineers',
    channel: 'team-automations-dev',
    owner: 'codelittinc',
    supports_deploy: false
  },
  'gh-hooks-repo-test': {
    devGroup: '@elbigode',
    channel: 'test-gh',
    deployChannel: 'test-gh-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'codelitt-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-website-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-website-codelitt', 'qa-codelitt-website', 'prod-codelitt-website']
  },
  'rolli': {
    devGroup: '@rolli-devs',
    channel: 'team-rolli-dev',
    deployChannel: 'team-rolli-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-rolli', 'qa-rolli', 'prod-rolli']
  },
  'team-maker': {
    devGroup: '@team-maker-devs',
    channel: 'team-teammaker-dev',
    deployChannel: 'wg-teammaker-deploy',
    owner: 'codelittinc',
    supports_deploy: true,
    servers: ['dev-team-maker', 'qa-team-maker', 'prod-team-maker']
  },
  'zonda': {
    devGroup: '@zonda-devs',
    channel: 'team-zonda-dev',
    deployChannel: 'wg-zonda-deploy',
    owner: 'codelittinc',
    servers: ['dev-zonda', 'qa-zonda', 'prod-zonda'],
    supports_deploy: true,
  },
  'ay-design-library': {
    devGroup: '@ay-devs',
    channel: 'team-ay-pia-web-dev',
    owner: 'codelittinc'
  },
  'ay-properties-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-pia-web': {
    devGroup: '@ay-desktop-devs',
    channel: 'team-ay-pia-web-dev',
    owner: 'codelittinc',
    deployChannel: 'team-pia-web-deploy',
    supports_deploy: true
  },
  'ay-excel-import-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-excel-import-app': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'ay-property-intelligence': {
    devGroup: '@ay-mobile-devs',
    channel: 'team-ay-pia-dev',
    deployChannel: 'team-ay-pia-deploy',
    owner: 'codelittinc',
    supports_deploy: true
  },
  'ay-users-api': {
    devGroup: '@ay-backend-devs',
    channel: 'team-ay-dev',
    owner: 'codelittinc'
  },
  'blog-v2': {
    devGroup: '@website-devs',
    channel: 'team-website-dev',
    deployChannel: 'team-blog-deploy',
    owner: 'codelittinc',
    supports_deploy: false,
    servers: ['dev-codelitt-blog']
  },
  'test-channel': {
    channel: 'test-channel',
    owner: 'codelittinc'
  },
}

const ghToSlackUsers = {
  kaiomagalhaes: 'kaiomagalhaes',
  alesmit: 'alex',
  alessandromontividiu03: 'alessandro.alves',
  diogoribeiro: 'diogo',
  gabrielpanga: 'gabriel',
  lua121: 'lua',
  neonima: 'vinny',
  paulohfev: 'paulo.fernandes',
  presnizky: 'pablo',
  raphaelsattler: 'raphael.sattler',
  tolastarras: 'rafael.sobrino',
  victor0402: 'victor.carvalho',
  ascinocco: 'anthony.scinocco',
  mvillalba2016: 'mauricio.villaalba',
  pvieiraguimaraes: 'pedro.guimaraes',
  'Manuel-Lajo-Salazar': 'manuel.lajo',
  jacksonpires: 'jackson.pires'
};

const getRepositoryData = (repositoryName) => repositoriesIdentifiers[repositoryName];
const getRepositoryDataByDeployChannel = (channel) => {
  const key = Object.keys(repositoriesIdentifiers).find(k => {
    const v = repositoriesIdentifiers[k];
    return v.deployChannel === channel;
  })

  return {
    ...(repositoriesIdentifiers[key] || {}),
    repository: key
  }
};

const getRepositoryDataByServer = (server) => {
  const key = Object.keys(repositoriesIdentifiers).find(k => {
    const v = repositoriesIdentifiers[k];
    return v.servers && v.servers.indexOf(server) >= 0;
  })

  return repositoriesIdentifiers[key];
};

const getSlackUser = (ghUser) => ghToSlackUsers[ghUser.toLowerCase()]
const getAdminSlackUser = () => 'kaiomagalhaes';

export default {
  getRepositoryData,
  data: repositoriesIdentifiers,
  getSlackUser,
  getAdminSlackUser,
  getRepositoryDataByDeployChannel,
  getRepositoryDataByServer
};
