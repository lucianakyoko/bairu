import { Injectable } from "@nestjs/common";

@Injectable()
export class CurrentUserService {
  getUserId(): string {
    const userId = process.env.DEV_USER_ID;

    if (!userId) {
      throw new Error("DEV_USER_ID must be configured in development.");
    }

    return userId;
  }
}
