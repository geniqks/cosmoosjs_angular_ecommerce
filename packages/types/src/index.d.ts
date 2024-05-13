// This file will contain the shared types for the applications.

export interface ISocketMessage<T> {
  event: string,
  data: T
}

export interface ISocketReceivedMessage {
  control: string;
  value: string | boolean;
}