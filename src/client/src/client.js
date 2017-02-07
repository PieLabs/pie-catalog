const status = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

const json = (response) => response.json();

class Elements {

  version() {
    return fetch('/version')
      .then(status)
      .then(json)
      .catch(e => {
        console.log('/version error: ', e);
        Promise.resolve();
      });
  }

  list() {
    return fetch('/api/element')
      .then(json)
      .catch(e => {
        console.error(e);
      });
  }

  load(org, repo) {
    return fetch(`/api/element/${org}/${repo}`)
      .then(status)
      .then(json)
      .catch(e => {
        console.error(e);
      });
  }

  listByOrg(org) {
    return fetch(`/api/org/${org}`)
      .then(status)
      .then(json)
      .catch(e => {
        console.error(e);
      });
  }

}

export let elements = new Elements();