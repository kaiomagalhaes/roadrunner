const getContent = (json) => {
  const content = {
    action_type: 'opened',
    link: json.pull_request.html_url,
    repository_name: json.repository.name
  }

  return content;
}

exports.getContent = getContent;