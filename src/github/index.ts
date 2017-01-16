import fetch from 'node-fetch';

export interface GithubService {
  loadInfo(org: string, repo: string): Promise<any>;
}

export class MainGithubService implements GithubService {

  async loadInfo(org: string, repo: string): Promise<any> {
    let response = await fetch(`http://api.github.com/repos/${org}/${repo}`);

    if (response.ok) {
      let json = await response.json();
      return json;
    } else {
      throw new Error('error loading github info')
    }
  }
}