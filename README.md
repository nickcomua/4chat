# T3 ChatCloneathon Project

This is my submission for the [T3 ChatCloneathon](https://cloneathon.t3.chat/) competition.

## Core Requirements

- [x] Chat with Various LLMs
  - [x] Multiple language model support
  - [ ] Multiple provider support
- [x] Authentication & Sync
  - [x] User authentication
  - [x] Chat history synchronization
- [x] Browser Friendly
  - [x] Responsive design
  - [ ] Cross-browser compatibility
- [ ] Easy to Try
  - [ ] Clear setup instructions
  - [ ] Demo deployment

## Bonus Features

- [ ] Attachment Support
  - [ ] Image uploads
  - [ ] PDF uploads
- [ ] Image Generation Support
  - [ ] AI-powered image generation
- [x] Syntax Highlighting
  - [x] Code formatting
  - [x] Multiple language support
- [x] Resumable Streams
  - [x] Continue generation after page refresh
- [ ] Chat Branching
  - [ ] Alternative conversation paths
- [ ] Chat Sharing
  - [ ] Public share links
- [ ] Web Search
  - [ ] Real-time search integration
- [x] Bring Your Own Key
  - [x] OpenRouter support
  - [ ] Custom API key configuration

## Tech Stack

- Next.js
- Couchdb
- Postgres (For effect workflows) 

## Getting Started

### Prerequisites

Create `.env.local` file with this params
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="V380Fw4A0vvZu5RaG4IwKv2TybDxT9ZHIwzHOl/wMU8=" # Added by `npx auth`. Read more: https://cli.authjs.dev

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# CouchDB Configuration for Next.js
COUCHDB_USER=
COUCHDB_PASSWORD=

# Public CouchDB URL (accessible from client-side)
DOMAIN=localhost
NEXT_PUBLIC_COUCHDB_URL=http://localhost:5984/
COUCHDB_URL=http://couchdb:5984/
# if runing next js localy
#COUCHDB_URL=http://localhost:5984/
POSTGRES_HOST=pgdb
#if runing next js localy
# POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_PASSWORD=
# Environment
# NODE_ENV=development

```


## Development

```
docker-compose --env-file .env.local -f docker-compose.dev.yml up
pnpm i
pnpm dev
```

## Deployment

docker-compose --env-file .env.local up

## Competition Rules Compliance

- [ ] Open Source with permissive license (MIT/Apache/BSD)
- [ ] GitHub repository public
- [ ] Team size within limit (≤ 4 people)
- [ ] Code of Conduct compliant
- [ ] Content usage acknowledgment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.