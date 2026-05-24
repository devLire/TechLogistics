import type { UserResponse } from "./user.response";

export interface AuthResponse {
    status: string;
    user:   UserResponse;
    token:  string;
}