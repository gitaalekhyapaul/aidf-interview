import { ChatAnthropic } from "@langchain/anthropic";
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoService } from "./mongodb.service";
import { questions } from "../data/questions";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { EnsembleRetriever } from "langchain/retrievers/ensemble";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { config } from "dotenv";
import { Question } from "../@types";
import { v4 } from "uuid";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

config();

export class LanggraphService {
  private static instance: LanggraphService | null = null;
  private static llm = new ChatAnthropic({
    model: "claude-3-5-haiku-20241022",
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    temperature: 0,
  });
  private static embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGEAI_API_KEY || "",
    modelName: "voyage-3",
    inputType: "document",
  });

  private static chatAgent: ReturnType<typeof createReactAgent> | null = null;
  private static chatDocs: Document[] = [];
  private static chatVectorStore: MongoDBAtlasVectorSearch | null = null;
  private static suggestionDocs: Document[] = [];
  private static suggestionVectorStore: MongoDBAtlasVectorSearch | null = null;
  private static originalQuestions: Question[] = [];

  private constructor() {}

  private static async getVectorSearchClient(
    collectionName: string
  ): Promise<MongoDBAtlasVectorSearch> {
    const mongo = await MongoService.getClient();
    const collection = mongo
      .db("aidf-be")
      .collection(
        `vector-store` +
          (collectionName.length > 0 ? `-${collectionName.toLowerCase()}` : "")
      );
    return new MongoDBAtlasVectorSearch(LanggraphService.embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
  }

  private static async loadDocuments() {
    {
      LanggraphService.chatDocs = questions.map((question) => {
        return new Document({
          pageContent: `ID: ${question.id}
Topic: ${question.topic}
Subtopic: ${question.subtopic || "N/A"}
Difficulty: ${question.difficulty}
Question: ${question.question}
Choices: ${question.choices.join(", ")}
Correct Answer: ${question.correct_answer}
Explanation: ${question.explanation}
Formula Used: ${question.formula_used || "N/A"}
Keywords: ${question.keywords ? question.keywords.join(", ") : "N/A"}
Image: ${question.image || "N/A"}
LOS Reference: ${question.LOS_reference || "N/A"}`,
          metadata: {
            ...question,
          },
          id: question.id,
        });
      });
      console.log(
        `[langgraph] Loaded ${LanggraphService.chatDocs.length} chat documents`
      );
      LanggraphService.suggestionDocs = questions.map((question) => {
        return new Document({
          pageContent: `ID: ${question.id}
Topic: ${question.topic}
Subtopic: ${question.subtopic || "N/A"}
Difficulty: ${question.difficulty}
Question: ${question.question}
Choices: ${question.choices.join(", ")}`,
          metadata: {
            id: question.id,
            topic: question.topic,
            subtopic: question.subtopic || "N/A",
            difficulty: question.difficulty,
            question: question.question,
            choices: question.choices.join(", "),
          },
          id: question.id,
        });
      });
      console.log(
        `[langgraph] Loaded ${LanggraphService.suggestionDocs.length} suggestion documents`
      );
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splittedChatDocs = await textSplitter.splitDocuments(
        LanggraphService.chatDocs
      );
      console.log(
        `[langgraph] Split chat documents into ${splittedChatDocs.length} chunks`
      );
      const splittedSuggestionDocs = await textSplitter.splitDocuments(
        LanggraphService.suggestionDocs
      );
      console.log(
        `[langgraph] Split suggestion documents into ${splittedSuggestionDocs.length} chunks`
      );
      LanggraphService.chatVectorStore =
        await LanggraphService.getVectorSearchClient("chatDocs");
      LanggraphService.suggestionVectorStore =
        await LanggraphService.getVectorSearchClient("suggestionDocs");
      const docsClient = await MongoService.getClient();
      const docsCount = await docsClient
        .db("aidf-be")
        .collection("vector-store-chatdocs")
        .countDocuments();
      console.log(
        `[langgraph] Vector store chatDocs has ${docsCount} documents`
      );
      if (docsCount > 0) {
        console.log("[langgraph] chatDocs already exists in vector store");
      } else {
        await LanggraphService.chatVectorStore.addDocuments(splittedChatDocs, {
          ids: LanggraphService.chatDocs.map(
            (doc) => `${doc.id}-${v4()}` || ""
          ),
        });
        console.log(
          `[langgraph] Added ${splittedChatDocs.length} chat documents to vector store`
        );
      }
      const suggestionDocsCount = await docsClient
        .db("aidf-be")
        .collection("vector-store-suggestiondocs")
        .countDocuments();
      console.log(
        `[langgraph] Vector store suggestionDocs has ${suggestionDocsCount} documents`
      );
      if (suggestionDocsCount > 0) {
        console.log(
          "[langgraph] suggestionDocs already exists in vector store"
        );
      } else {
        await LanggraphService.suggestionVectorStore.addDocuments(
          splittedSuggestionDocs,
          {
            ids: LanggraphService.suggestionDocs.map(
              (doc) => `${doc.id}-${v4()}` || ""
            ),
          }
        );
        console.log(
          `[langgraph] Added ${splittedSuggestionDocs.length} suggestion documents to vector store`
        );
      }
      LanggraphService.originalQuestions = questions;
      console.log(
        `[langgraph] Loaded ${LanggraphService.originalQuestions.length} original questions`
      );
    }
  }

  private static async buildEnsembleRetrievers() {
    const chatBM25Retriever = await BM25Retriever.fromDocuments(
      LanggraphService.chatDocs,
      {
        k: 8,
      }
    );
    const chatVectorRetriever = LanggraphService.chatVectorStore!.asRetriever({
      k: 8,
    });
    const suggestionBM25Retriever = await BM25Retriever.fromDocuments(
      LanggraphService.suggestionDocs,
      {
        k: 8,
      }
    );
    const suggestionVectorRetriever =
      LanggraphService.suggestionVectorStore!.asRetriever({
        k: 8,
      });
    const chatRetriever = new EnsembleRetriever({
      retrievers: [chatBM25Retriever, chatVectorRetriever],
      weights: [0.5, 0.5],
    });
    const suggestionRetriever = new EnsembleRetriever({
      retrievers: [suggestionBM25Retriever, suggestionVectorRetriever],
      weights: [0.5, 0.5],
    });
    return { chatRetriever, suggestionRetriever };
  }

  private static async init() {
    console.log("[langgraph] Initializing LanggraphService");
    await LanggraphService.loadDocuments();
    await LanggraphService.initChatAgent();
    console.log("[langgraph] LanggraphService OK");
  }

  public static async getInstance(): Promise<LanggraphService> {
    if (!LanggraphService.instance) {
      LanggraphService.instance = new LanggraphService();
      await LanggraphService.init();
    }
    return LanggraphService.instance;
  }

  private static async initChatAgent() {
    const mongoClient = await MongoService.getClient();
    const chatRetrieverSchema = z.object({
      query: z.string().describe("The query to search for in chat documents"),
    });

    const retrieveChatDocs = tool(
      async ({ query }: { query: string }) => {
        const { chatRetriever } =
          await LanggraphService.buildEnsembleRetrievers();
        const retrievedDocs = await chatRetriever.invoke(query);
        const serialized = retrievedDocs
          .map((doc) => doc.pageContent)
          .join("\n\n");
        return [serialized, retrievedDocs];
      },
      {
        name: "retrieve_chat_docs",
        description: "Retrieve chat documents based on a query",
        schema: chatRetrieverSchema,
        responseFormat: "content_and_artifact",
      }
    );
    LanggraphService.chatAgent = createReactAgent({
      llm: LanggraphService.llm,
      tools: [retrieveChatDocs],
      checkpointSaver: new MongoDBSaver({
        client: mongoClient,
        dbName: "aidf-be",
        checkpointCollectionName: "langgraph-checkpoints",
        checkpointWritesCollectionName: "langgraph-checkpoint-writes",
      }),
    });
  }

  public async getChatResponse(query: string, thread_id: string) {
    const response = await LanggraphService.chatAgent!.invoke(
      { messages: [new HumanMessage(query)] },
      {
        configurable: {
          thread_id,
        },
      }
    );
    const res = [...response.messages].reverse();
    const aiResponse = res.find((msg) => msg instanceof AIMessage);
    if (!aiResponse) {
      throw new Error("No AI response found in the messages");
    }
    return aiResponse.content;
  }
}
