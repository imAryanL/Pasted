---
name: Mobile Responsive Audit — April 2026
description: Pre-deploy mobile audit findings; 9 issues found, 6 fixes applied or pending
type: project
---

Mobile audit completed 2026-04-11. Key issues found:

1. Landing page logo/title breaks at 375px — `text-6xl` too large, negative margin `-ml-4` clips "P" off screen
2. PasteInput — pill container stacks badly on mobile; button text "Saving..." wraps; no `sm:` breakpoints
3. FilteredSaveGrid — search bar fixed `w-64` overflows on small screens; header row doesn't wrap
4. ActionableCard — progress bar section `w-44` is fixed-width, squishes/overflows at 375px
5. Actionables page header — `flex items-start justify-between` doesn't wrap; stats box overflows
6. Account page — `p-8` outer padding too tight on mobile; upgrade card has no mobile padding adjustment
7. Dashboard `main` — `px-6 py-12` is fine but `max-w-6xl` has no mobile override (acceptable)
8. Save detail modal — `max-w-4xl` is correctly overridden by base dialog `max-w-[calc(100%-2rem)]`, no issue
9. Sidebar — shadcn sidebar correctly converts to Sheet/offcanvas on mobile via `useIsMobile`, BUT there is no SidebarTrigger rendered anywhere in the layout — mobile users cannot open the sidebar

**Why:** The sidebar renders in a Sheet on mobile but nothing triggers it to open. SidebarTrigger must be added to the main content area.

**How to apply:** All fixes are tracked below; prioritize the sidebar trigger (blocks navigation on mobile) and the paste input overflow (primary interaction).
