import type { Credentials } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api";
const CATALOG_SERVICE = "/api/catalog";
const ORDER_SERVICE = "/api/order";

// Auth service
export const login = (credentials: Credentials) =>
  api.post(`/auth/login`, credentials);

export const self = () => api.get(`/auth/self`);

export const logout = () => api.post(`/auth/logout`);
