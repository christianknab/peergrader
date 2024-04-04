PeerGrader


__To run locally__ (not in the docker container) run `npm run dev`

the api keys are required to run the app. create a file `.env.local` in the root directory

find in the organization -> settings -> API

```
NEXT_PUBLIC_SUPABASE_URL=supa_base_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_public_key
```


__To use docker__

* first time running it or to recompile image - `docker-compose up --build`
* after that - `docker-compose up`
* to close port - `docker-compose down`