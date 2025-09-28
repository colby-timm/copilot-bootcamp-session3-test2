# Product Requirements Document (PRD) - Todo App Enhancements (Due Dates, Priority, Filters)

## 1. Overview
The existing Todo app currently supports only a task title and completion status. Based on the Sept 16 meeting transcript and the Sept 17 Slack confirmation, the goal is to incrementally enhance the app to improve task organization while keeping the initial release (MVP) simple and teachable. Enhancements focus on adding optional due dates, a simple three-level priority, and basic filtering—implemented fully on the frontend with local storage only and without backend changes.

---

## 2. MVP Scope
All items below are explicitly confirmed as in-scope for the MVP.

Data Model (per Slack confirmation):
- title: required (non-empty)
- priority: enum "P1" | "P2" | "P3"; default "P3" if absent or invalid
- dueDate: optional; must be a valid ISO date string in format YYYY-MM-DD; invalid values are ignored (treated as no due date)
- completed: existing field (unchanged behavior)

Features / Behavior:
- Add ability to set optional due date when creating or editing a task.
- Add ability to assign priority (P1, P2, P3) with default P3.
- Filtering views: All, Today, Overdue.
  - All: shows all tasks (completed and incomplete).
  - Today: shows only incomplete tasks whose dueDate equals the current date.
  - Overdue: shows only incomplete tasks whose dueDate is before the current date.
- Local-only persistence (e.g., local storage); no backend or external storage changes.

Validation Rules:
- Invalid priority values fall back to P3.
- Invalid or malformed dueDate strings are ignored (task stored without a due date).

Assumptions Explicitly Supported by Artifacts (not extending beyond them):
- Date comparisons use the current local calendar date (no timezone normalization beyond that is stated).
- No sorting behavior is mandated for MVP beyond existing/default list order (sorting rules were deferred—see Post-MVP).
- No visual styling requirement for overdue highlighting is included in MVP (explicitly moved to Post-MVP). 

---

## 3. Post-MVP Scope
Confirmed as deferred (not in MVP) but in planned future scope.

- Visual highlighting of overdue tasks (e.g., distinct styling such as red highlight) — per meeting desire; explicitly deferred in Slack.
- Sorting rules for task list:
  1. Overdue tasks first
  2. Then by priority (P1 → P2 → P3)
  3. Then by due date ascending
  4. Tasks without a due date last

---

## 4. Out of Scope
Explicitly confirmed as out of scope for both MVP and immediate Post-MVP phase:
- Notifications / reminders
- Recurring tasks
- Multi-user functionality
- Keyboard navigation / advanced accessibility features
- External / cloud / backend storage (remain local-only)

---

## Notes / Clarifications Needed (Not Classified Yet)
The meeting transcript discussed color-coded priority badges (e.g., red P1, orange P2, gray P3), but the Slack confirmation did not explicitly classify this visual styling as MVP or Post-MVP. Since it was not reaffirmed in the Slack scope lists, it is intentionally excluded from the MVP/Post-MVP lists above pending explicit confirmation.

---

## Acceptance Criteria (Derived Directly from Confirmed MVP Requirements)
1. Creating a task without specifying priority stores priority = "P3".
2. Supplying an invalid priority value (e.g., "P4") results in stored priority = "P3".
3. Supplying an invalid due date (e.g., malformed string) results in the task being stored without a due date.
4. Today filter returns only incomplete tasks whose dueDate matches the current date.
5. Overdue filter returns only incomplete tasks whose dueDate is before the current date.
6. All filter returns all tasks regardless of completion status.
7. Clearing an existing valid due date results in the task persisting without a due date.

(These criteria avoid assumptions beyond the confirmed artifacts.)
