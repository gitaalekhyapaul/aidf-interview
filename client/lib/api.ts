import {
  GetChatResponse,
  Question,
  QuizAnswerResponse,
  SendChatResponse,
} from "@/@types";
import axios from "axios";

export class Api {
  private static instance: Api;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  public async getNextQuestion(): Promise<Question | undefined> {
    try {
      const { data } = await axios.get<Question>("/api/questions/next");
      return data;
    } catch (error) {
      console.error("Error fetching next question:", error);
    }
  }

  public async submitAnswer(
    questionId: string,
    userAnswer: string
  ): Promise<QuizAnswerResponse | undefined> {
    try {
      const { data } = await axios.post<QuizAnswerResponse>(
        "/api/questions/answer",
        {
          questionID: questionId,
          userAnswer,
        }
      );
      return data;
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  }

  public async getChat(): Promise<GetChatResponse | undefined> {
    try {
      const { data } = await axios.get<GetChatResponse>("/api/chat");
      return data;
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  }

  public async postChat(query: string): Promise<SendChatResponse | undefined> {
    try {
      const { data } = await axios.post<SendChatResponse>("/api/chat", {
        query,
      });
      return data;
    } catch (error) {
      console.error("Error posting chat:", error);
    }
  }
}
