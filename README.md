# aidf-interview

# Preview: Desktop

| ![Desktop 1](./docs/desktop1.jpeg) | ![Desktop 2](./docs/desktop2.jpeg) | ![Desktop 3](./docs/desktop3.jpeg) |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| ![Desktop 4](./docs/desktop4.jpeg) | ![Desktop 5](./docs/desktop5.jpeg) | ![Desktop 6](./docs/desktop6.jpeg) |

# Preview: Phone

| ![Phone 1](./docs/phone1.jpeg) | ![Phone 2](./docs/phone2.jpeg) | ![Phone 3](./docs/phone3.jpeg) |
| ------------------------------ | ------------------------------ | ------------------------------ |
| ![Phone 4](./docs/phone4.jpeg) | ![Phone 5](./docs/phone5.jpeg) | ![Phone 6](./docs/phone6.jpeg) |

# Stack Used

## Frontend:

- Next.JS
- Vercel v0 for wire-framing and mock UI
- Lucide React for icons
- Tailwind for CSS

### Execution Instructions:

- ```
    cd client
  ```
- ```
  npm install
  ```
- copy the `.env.example` file and create a `.env.local` file

- ```
    npm run dev
  ```

## Backend:

- Express.JS in TypeScript
- LangGraph ReAct agent for RAG agents (both question suggestion, and chat bot)
- MongoDB for vector store
- Anthropic for chat model
- BM25 and vector store ensemble retriever with equal weighted
- Redis for ephemeral storage and chat history storage

### Execution Instructions:

- ```
    cd server
  ```
- ```
  npm install
  ```
- copy the `.env.example` file and create a `.env` file

- ```
    npm run dev
  ```
