# aidf-interview

# Preview Link
https://aidf.gpaul.cc

# System Architecture

![System Architecture](./docs/architecture.png)

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

# More about the RAG agent(s)
There are two ReAct agents running in the system, one agent makes sure that the user always has a chat button to ask questions, which it can answer based on the [question bank](./server/src/data/questions.ts) provided for this task and the other agent tries to find out similar problems which the user can solve, in the case they make mistakes while answering the questions. They can try out similar questions suggested by the AI, and can improve their learning. Both the agents are written using pre-built LangGraph agents, and are provided the JSON data in the form of embeddings. Since we were supposed to use Anthropic for the chat model, I decided to move forward with VoyageAI embeddings. After loading the documents into the system, and then using the recursive text splitter to split into smaller chunks, I embedded them into vectors using the Voyage AI model. The embeddings were then stored in MongoDB which acted as the choice of vector store for this project. To maintain persistence of memory and state of the graph, I've also used MongoDB as the choice of checkpointer for the graph. Additionally, I used Redis to maintain the state of the messages unique to a thread. The backend uses cookies to set and maintain chat history, questions visited and the state of the graph. Redis is also used to keep track of the already visited questions, so that the user does not get stuck in a loop solving the same set of questions.
