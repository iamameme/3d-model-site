import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadFile(objectUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function getObjectUrlFromUrl(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch file");
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
}
