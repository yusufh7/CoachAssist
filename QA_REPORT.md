# CoachAssist test and improvements — 16 November 2026

## Verified

- 49 frontend logic tests and 6 edge-function validation tests pass.
- A real U11, ten-player, 60-minute AI session generated in approximately 70 seconds, saved and survived refresh. Phase times were 12 + 16 + 24 + 8 = 60 minutes.
- Blank playing style, punctuation in team names, inline missing-field validation, and all U7–U18/adult age choices checked.
- A manual practice-name edit persisted after refresh.
- A real “Too easy” AI adjustment changed the practice, retained its 12 minutes and persisted after refresh.
- Duplicate and confirmed deletion worked. Only review-created sessions were deleted.
- Sharing allowed a fresh signed-out browser to read the session; disabling sharing blocked access again.
- Print view rendered without `undefined` and included safeguarding guidance.
- Coach Mode countdown decreased with elapsed time; pause, reset and next-practice controls worked.
- A real four-session progressive block completed, saved all four sessions and survived refresh.
- Main pages loaded without browser runtime errors; desktop, 843px tablet and 390px phone checks found no page-wide overflow.
- Signup password mismatch feedback and the password-recovery link worked without creating an artificial account.
- Database linter reported one informational locked-table finding; the service-only generation log intentionally has no client policies.

## Issues found and improvements built

1. **Search missed other categories:** searching for Goalkeeper Footwork from In Possession returned nothing. Search now spans every category with actual result counts and a useful empty state.
2. **Finding a suitable theme took too much browsing:** added player-count, available-time, level and age controls. Age does not imply unverified suitability; it excludes deliberate-heading themes for U12 and below using the existing age rule.
3. **Refresh lost unfinished planning:** raw team details and notes now recover within the browser tab, separated by account. Successful generation clears the unfinished form.
4. **Choosing a saved team replaced a library goal:** selecting a team now retains the chosen theme. Subsequent edits to that goal also survive refresh.
5. **Generation displayed invented progress stages:** status now reports actual elapsed time rather than claiming a particular internal step or promising completion.
6. **Pitchside view omitted the diagram and rules:** both are available directly in Coach Mode; the running timer uses the existing yellow accent.
7. **Editing retained misleading diagrams after organisation changes:** changing setup or description removes stale layout data. Saving has a busy state and explicit validation; styling now matches the workspace.
8. **Mobile category icons were ambiguous:** category names remain visible in a horizontally scrollable strip.

## Limitations and future improvements

- Email confirmation/reset delivery was not tested; no successful new-account email journey is claimed.
- Physical-device screen-awake behaviour and true offline access remain unverified. Browser-tab form recovery is not offline support.
- Only one adjustment type was exercised live during this review; not all six or every AI age/duration combination.
- Library entries remain theme summaries, not complete verified FA practices. Provenance review and real setup instructions are still needed.
- Legal operator identity, contact details and retention policy need the owner's real information.
- Analytics remains pending the owner's privacy decision.
- AI planning is functional but comparatively slow; the elapsed-time display improves honesty, not generation speed.
- No payment tiers, subscriptions or publication were changed.

Review-only sessions, the review team and unfinished notes were removed. Existing coaching work was left untouched.