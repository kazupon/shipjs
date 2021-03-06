import getRemoteOriginUrl from './getRemoteOriginUrl';
import gh from 'parse-github-url';

export default function getRepoURL(remote, dir) {
  const url = getRemoteOriginUrl(remote, dir);
  const { repo } = gh(url);
  return `https://github.com/${repo}`;
}
