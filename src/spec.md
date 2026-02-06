# Specification

## Summary
**Goal:** Improve readability of the sequentially appearing text inside the “Why I Love You ❤️” modal by adding a stronger, high-contrast background treatment behind the text without changing the existing copy.

**Planned changes:**
- Add/strengthen a dedicated background panel (e.g., darker/translucent or stronger frosted layer) behind the modal’s love lines so each line is readable as it fades in.
- Ensure the modal layout remains mobile-first: prevent text from overlapping other UI elements and make the modal body scrollable when content exceeds the viewport height.
- Verify modal layering and interactions: modal/overlay stay above the proposal screen, clicks/taps outside close the modal, and clicks inside do not.

**User-visible outcome:** After clicking “Why I Love You ❤️”, the modal’s 5 lines fade in as before but are clearly readable on both mobile and desktop, with proper scrolling and correct modal overlay behavior.
