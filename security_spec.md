# Security Specification for Univue Consultants

## Data Invariants
1. A **User** profile must belong to the authenticated user (`request.auth.uid == userId`).
2. Users cannot self-assign the `admin` role.
3. **Documents** are only accessible by their `ownerId` or if the user is an `admin`.
4. Timestamps (`createdAt`, `updatedAt`) must be server-generated.

## The Dirty Dozen Payloads

1. **Identity Theft**: Creating a `users/{someoneElseUid}` document while logged in as `myUid`.
2. **Privilege Escalation**: Creating/Updating own profile with `role: "admin"`.
3. **Ghost Field Injection**: Adding `isVerified: true` to a user profile to bypass backend checks.
4. **ID Poisoning**: Using a 1MB string as a `userId` to cause resource exhaustion.
5. **Timestamp Spoofing**: Setting `createdAt` to a date in the past.
6. **Orphaned Document**: Creating a `Document` with an `ownerId` that doesn't exist.
7. **Cross-Tenant Access**: User A attempts to `get` User B's `Document`.
8. **Insecure Query**: Client attempts to list ALL users without a `where("uid", "==", myUid)` filter.
9. **Update Gap**: Attempting to change `email` on a user profile (should be immutable or strictly controlled).
10. **Resource Exhaustion**: Writing a 1MB string into the `displayName` field.
11. **State Shortcut**: Changing a document `type` from `PDF` to an invalid enum value.
12. **Malicious Deletion**: User B tries to `delete` User A's profile.

## Test Runner (Conceptual)
The `firestore.rules.test.ts` would verify that all the above attempts return `PERMISSION_DENIED`.
