import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "@/lib/dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return dayjs(dateString).format("DD/MM/YYYY");
}

export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format("DD/MM/YYYY HH:mm");
}

export function fromNow(dateString: string): string {
  return dayjs(dateString).fromNow();
}
