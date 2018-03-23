import { router } from './router';
import { Request, Response, Next } from 'restify';
import axios, { AxiosPromise, AxiosResponse, AxiosError } from 'axios';
import { IRepo, IRepoContent, ICommit, ITreeNode } from '../../models/';

import { buildTree } from '../../utils/tree-builder';


function retriveUserRepos(user: string): AxiosPromise<Array<IRepo>> {
    return axios.get<Array<IRepo>>(`https://api.github.com/users/${user}/repos`);
}

function retrieveLatestCommit(user: string, repo: string): AxiosPromise<Array<ICommit>> {
    return axios.get<Array<ICommit>>(`https://api.github.com/repos/${user}/${repo}/commits`);
}

function retrieveFileTree(user: string, repo: string, sha: string): AxiosPromise<Array<ITreeNode>> {
    return axios.get(`https://api.github.com/repos/${user}/${repo}/git/trees/${sha}?recursive=1`);
}

function retriveRepoContent(user: string, repo: string, path: string): AxiosPromise<Array<IRepoContent>> {
    return axios.get<Array<IRepoContent>>(`https://api.github.com/repos/${user}/${repo}/contents/${path}`);
}

router.get('/repos/:user', (req: Request, res: Response, next: Next) => {
    const { user } = req.params;
    retriveUserRepos(user)
        .then((response: AxiosResponse) => {
            res.json(response.data);
        })
        .catch((error: AxiosError) => {
            const { data, status } = error.response!;
            res.status(status)
            res.send(data);
        });
});

router.get('/repos/files/:user/:repo', (req: Request, res: Response, next: Next) => {
    const { user, repo } = req.params;
    retrieveLatestCommit(user, repo)
        .then((response1: AxiosResponse) => {
            const latestCommit = <ICommit>response1.data.pop();
            console.log(latestCommit.sha);
            retrieveFileTree(user, repo, latestCommit.sha)
                .then((response: AxiosResponse) => {
                    const fileTree = response.data;
                    const resp = <Array<ITreeNode>>buildTree(fileTree.tree);
                    console.log({ ...fileTree, tree: resp });
                    res.json({ ...fileTree, tree: resp });
                });
        });

});

export const repoRoutes = router;
