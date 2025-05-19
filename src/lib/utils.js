import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getLastUpdatedTime(timestamp) {
  const now = new Date();
  const updated = new Date(timestamp);

  const diffInSeconds = Math.floor((now - updated) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return updated.toLocaleDateString();
}

export function getSortedResumes(resumesArray) {
  if (!Array.isArray(resumesArray)) return [];

  return [...resumesArray].sort((a, b) => {
    const updatedA = new Date(a.updatedAt || 0);
    const updatedB = new Date(b.updatedAt || 0);
    return updatedB - updatedA; 
  });
}