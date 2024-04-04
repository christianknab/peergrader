PeerGrader

to run locally (not in the docker container) run `npm run dev`

the api keys are required to run the app. create a file `.env.local` in the root directory

find in the organization -> settings -> API

```
NEXT_PUBLIC_SUPABASE_URL=supa_base_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_public_key
```