# GitHub MCP Contracts

This directory contains JSON Schema contracts for GitHub API operations.

## Operations

### github.searchIssues (v1)
**Purpose:** Search for issues across GitHub repositories.

#### Request
Validates against: `contracts/github/searchIssues.request.json`

- `query` (string, required) - GitHub search query string
- `sort` (enum, optional) - Sort field:
  - `comments` - Number of comments
  - `reactions` - Reaction count
  - `reactions-+1` - Thumbs up reactions
  - `interactions` - Combined activity
  - `created` - Creation date
  - `updated` - Last update date
- `order` (enum, default: "desc") - Sort order: asc, desc
- `perPage` (integer, default: 30) - Results per page (1-100)
- `page` (integer, default: 1) - Page number for pagination

#### Response
Validates against: `contracts/github/searchIssues.response.json`

- `totalCount` (integer) - Total number of matching issues
- `items` (object[]) - Array of matching issues with:
  - `id` (integer) - Issue ID
  - `number` (integer) - Issue number
  - `title` (string) - Issue title
  - `state` (enum) - Issue state: open, closed
  - `body` (string, optional) - Issue description
  - `labels` (string[], optional) - Issue labels
  - `assignees` (string[], optional) - Assigned users
  - `createdAt` (datetime) - Creation timestamp
  - `updatedAt` (datetime) - Last update timestamp
- `incompleteResults` (boolean, optional) - Results incomplete due to timeout

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid query syntax
- `AUTH_REQUIRED` - Missing or invalid token (for private repos)
- `NOT_FOUND` - Repository not found
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - GitHub API error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

---

### github.searchPullRequests (v1)
**Purpose:** Search for pull requests across GitHub repositories.

#### Request
Validates against: `contracts/github/searchPullRequests.request.json`

- `query` (string, required) - GitHub search query string
- `sort` (enum, optional) - Sort field:
  - `comments` - Number of comments
  - `reactions` - Reaction count
  - `interactions` - Combined activity
  - `created` - Creation date
  - `updated` - Last update date
- `order` (enum, default: "desc") - Sort order: asc, desc
- `perPage` (integer, default: 30) - Results per page (1-100)
- `page` (integer, default: 1) - Page number for pagination

#### Response
Validates against: `contracts/github/searchPullRequests.response.json`

- `totalCount` (integer) - Total number of matching PRs
- `items` (object[]) - Array of matching pull requests with:
  - `id` (integer) - PR ID
  - `number` (integer) - PR number
  - `title` (string) - PR title
  - `state` (enum) - PR state: open, closed
  - `draft` (boolean, optional) - Whether PR is a draft
  - `body` (string, optional) - PR description
  - `labels` (string[], optional) - PR labels
  - `baseBranch` (string, optional) - Target branch
  - `headBranch` (string, optional) - Source branch
  - `createdAt` (datetime) - Creation timestamp
  - `updatedAt` (datetime) - Last update timestamp
- `incompleteResults` (boolean, optional) - Results incomplete due to timeout

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid query syntax
- `AUTH_REQUIRED` - Missing or invalid token (for private repos)
- `NOT_FOUND` - Repository not found
- `RATE_LIMIT` - Rate limit exceeded (5000/hour for authenticated)
- `UPSTREAM_ERROR` - GitHub API error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

## GitHub Search Query Syntax

Examples of valid query strings:
- `"repo:owner/name state:open"` - Open issues in a specific repo
- `"is:pr author:username"` - PRs by a specific author
- `"label:bug is:open"` - Open issues with bug label
- `"created:>2024-01-01"` - Items created after date

## Example Usage

```javascript
import { validateGitHubSearchIssues, validateGitHubSearchPRs } from '../validators/github';

// Search issues
const issueRequest = {
  query: "repo:Arcane-Fly/AetherOS is:issue state:open label:bug",
  sort: "created",
  order: "desc",
  perPage: 50,
  page: 1
};

await validateGitHubSearchIssues(issueRequest);

// Search pull requests
const prRequest = {
  query: "repo:Arcane-Fly/AetherOS is:pr is:open",
  sort: "updated",
  order: "desc",
  perPage: 30
};

await validateGitHubSearchPRs(prRequest);
```

## Rate Limiting

GitHub API rate limits:
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5000 requests/hour
- **Search API**: 30 requests/minute

Handle `RATE_LIMIT` errors with exponential backoff and respect `Retry-After` headers.

## Version History

- **v1.0.0** (2024-10) - Initial contract definitions
