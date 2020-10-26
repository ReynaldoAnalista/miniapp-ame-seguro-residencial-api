#  miniapp-ame-seguro-residencial-api

miniapp-ame-seguro-residencial-api para iniciar um novo micro serviço utilizando as tecnologias abaixo.

### Tecnologias
 - [Node.JS](https://nodejs.org/en/)
 - [RestifyJS](http://restify.com/)
 - [InversifyJS](http://inversify.io/)
 - [Typescript](https://www.typescriptlang.org/)
 - [Axios](https://github.com/axios/axios)

### Integração

- Autenticação
- Autorização de Pagamento

### Getting Started

Clone o projeto  
`git clone git@bitbucket.org:smartsolutionteam/miniapp-ame-seguro-residencial-api.git`

Crie um projeto no bitbucket, depois reorganize os _remotes_ do git

```
cd <nome do seu projeto>
git remote rename origin miniapp-ame-seguro-residencial-api
git remote add origin git@bitbucket.org:smartsolutionteam/<nome do seu projeto>.git
git push -u origin master
```

Desta forma você consegue puxar as atualizações do miniapp-ame-seguro-residencial-api no seu projeto rodando por exemplo:  
`git pull miniapp-ame-seguro-residencial-api master`

Instale as dependências  
`yarn`

Para rodar os testes  
`yarn test`

Para rodar os testes automaticamente  
`yarn test -- --watchAll`

Para rodar somente um arquivo de teste  
`yarn test -- --watchAll PaymentService`

## Todo

1) Automatizar a substituição do context path nos docker files dentro da pasta docker

## Ame

Para que os _commits_ sejam enviados para o github é necessáiro exportar a chave pública no bitbucket e cadastrar no github.

Atualmente 06/04/2020 a exportação da chave fica em `https://bitbucket.org/smartsolutionteam/<nome do seu projeto>/admin/addon/admin/pipelines/deployment-settings`

Cadastre a chave gerada do bitbucket no github
`https://github.com/AmeDigital/<nome do seu projeto>/settings/keys`

Habilite o pipelines no bitbucket
