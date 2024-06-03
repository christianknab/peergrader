# Peergrader
> Peer grading for students and instructors

## The problem 

**Professors** don’t have the bandwidth to grade hundreds of students. **Students** don’t like the current tool at UCSC: Crowdgrader.

## The goal

* Provide a cheap, modern design, with integration to Canvas gradebook for easy grade publishing
* A more intuitive interface to increase usability and confidence about submissions & grading

## Running the App

```
git@github.com:christianknab/peergrader.git
npm install
npm run dev
```

Development server should be running on `http://localhost:3000`.

API keys are required to run! Create a file `.env.local` in the root directory and put the following contents:

```
NEXT_PUBLIC_SUPABASE_URL=supa_base_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_public_key
```

## Contributors
* [**Christian Knab**](https://github.com/christianknab)
* [**Eliah Reeves**](https://github.com/nunibye)
* [**Aastha Verma**](https://github.com/aasthav12)
* [**Eric Chuang**](https://github.com/ericbreh)

## Deplayment
Deploys on Vercel every commit.

## Technologies
* Next.js
* Typescript XML
* PostgreSQL

## Infrastructure
* Auth: Supabase
* PostgreSQL database: Supabase
* Storage (files): Supabase
* Deployment: Vercel
* GitHub: Version control
