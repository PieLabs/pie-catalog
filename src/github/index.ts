import fetch, { Response } from 'node-fetch';
import { buildLogger } from '../log-factory';
import { Readable } from 'stream';
import * as url from 'url';
import * as _ from 'lodash';
const logger = buildLogger();

export interface GithubService {
  loadInfo(org: string, repo: string): Promise<any>;
  user(user: string): Promise<any>;
  avatar(org: string): Promise<Response>;
}

export class MainGithubService implements GithubService {

  async user(user: string): Promise<any> {
    let response = await fetch(`https://api.github.com/users/${user}`);
    return response.json();
  }

  private async urlResponse(url: string): Promise<Response> {
    logger.debug(`[urlResponse]: ${url}`);
    return fetch(url);
  }

  async avatar(user: string): Promise<Response> {
    let u = await this.user(user);
    logger.debug('[avatar] avatar_url: ', u.avatar_url);
    let parsed = url.parse(u.avatar_url, true);
    parsed.query = _.extend(parsed.query, { s: 40 });
    delete parsed.search;
    let updatedUrl = url.format(parsed);
    logger.debug('[avatar] updatedUrl: ', updatedUrl);
    return await this.urlResponse(updatedUrl);
  }

  async loadInfo(org: string, repo: string): Promise<any> {

    let url = `http://api.github.com/repos/${org}/${repo}`;
    logger.info('[loadInfo] url: ', url);

    let response = await fetch(url);

    if (response.ok) {
      return await response.json();
    } else {
      return Promise.reject(new Error('error loading github info'));
    }
  }
}