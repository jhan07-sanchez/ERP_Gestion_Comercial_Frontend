// src/components/alerts/AlertContext.ts
import { createContext } from "react";
import type { AlertContextType } from "./types";

export const AlertContext = createContext<AlertContextType | undefined>(undefined);
