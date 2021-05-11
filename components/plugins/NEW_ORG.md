# how to setup a new organization

To setup a fake org for the Bellingen Courier-Sun (a real local paper where I live), I did the following:

```
git clone git@github.com:news-catalyst/next-tinynewsdemo.git bello
cd bello
yarn
cp ~/Projects/newscatalyst/webiny-stack/frontend-site/.env.local-oaklyn .env.local-bello
cp ~/Projects/newscatalyst/webiny-stack/frontend-site/script/credentials.json script/
vim .env.local-bello
./script/switch bello
yarn bootstrap -l en-US -e jacqui@newscatalyst.org
```
