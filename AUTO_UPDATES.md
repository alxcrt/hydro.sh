# Dependency updates

Dependabot checks application dependencies and Docker bases daily. Routine
releases cool down for three days; security updates bypass that delay. Actions
are checked weekly. Patch/minor updates may merge only after the required
`Dependency gate` passes on an up-to-date branch. Major changes remain PRs for
compatibility/migration review. A failed check blocks merge and deployment.

The privileged merge workflow never checks out or executes PR code. Keep the
required Actions check and administrator enforcement enabled in branch
protection. Coolify uses the existing deployment webhook and bounded builder.
Back up state before migrations; an old image does not reverse a data migration.
