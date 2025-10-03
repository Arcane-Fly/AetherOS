/**
 * Sample helper utilities demonstrating AetherOS naming conventions
 * - File name: camelCase
 * - Function names: camelCase
 * - Constants: UPPER_SNAKE_CASE
 * - Type definitions: PascalCase
 */

// Constants using UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
const MAX_RETRY_ATTEMPTS = 3;

// Type definitions using PascalCase
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

/**
 * Formats a date into a human-readable string
 * @param date - Date object or ISO string
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'relative':
      return getRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Gets relative time from a date (e.g., "2 hours ago")
 * Private helper function
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins} minutes ago`;
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hours ago`;
  return `${Math.floor(diffInMins / 1440)} days ago`;
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = DEFAULT_TIMEOUT_MS
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Capitalizes first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a unique ID
 * @returns Unique identifier string
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Example async function with proper error handling
 * @param userId - User ID to fetch
 * @returns User data or null if not found
 */
export async function fetchUserData(userId: string): Promise<UserData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<UserData> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Export constants for use in other modules
export { API_BASE_URL, DEFAULT_TIMEOUT_MS, MAX_RETRY_ATTEMPTS };

// Export types
export type { ApiResponse, UserData };
