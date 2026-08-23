import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "@/lib/dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const parsed = dayjs(dateString, [
    "DD/MM/YYYY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "DD-MM-YYYY",
  ]);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY") : dateString;
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "";
  const parsed = dayjs(dateString, [
    "DD/MM/YYYY HH:mm",
    "YYYY-MM-DD HH:mm",
    "YYYY-MM-DDTHH:mm:ss",
  ]);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : dateString;
}

export function fromNow(dateString: string): string {
  if (!dateString) return "";
  return dayjs(dateString).fromNow();
}
