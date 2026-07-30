# Fix Ninja Build Loop in expo-modules-core

The build is failing with `ninja: error: manifest 'build.ninja' still dirty after 100 tries`. This indicates a circular dependency or timestamp issue where Ninja repeatedly tries to re-run CMake to regenerate build files, but consistently finds them "dirty" even after regeneration.

## User Review Required

> [!IMPORTANT]
> The primary fix involves manually deleting the `.cxx` directory within `node_modules/expo-modules-core/android/`. Since this is inside `node_modules`, it is a temporary fix that might be reverted if `node_modules` is re-installed. I will also propose a change to the `build.gradle` in `expo-modules-core` to prevent this from happening in the future by restricting the `generateStubPCH` task.

## Proposed Changes

### [expo-modules-core](file:///C:/ALL/Projects_code/FightingGuide/code/Fighting-guide-expo/node_modules/expo-modules-core/android)

#### [MODIFY] [build.gradle](file:///C:/ALL/Projects_code/FightingGuide/code/Fighting-guide-expo/node_modules/expo-modules-core/android/build.gradle)

Restrict the `generateStubPCH` task to only operate on `Debug` build configurations. This task is intended to help the IDE's C++ engine during sync (which typically uses Debug), and its aggressive modification of file timestamps in the `.cxx` directory is likely causing the Ninja loop when building other configurations like `RelWithDebInfo`.

#### [DELETE] [.cxx](file:///C:/ALL/Projects_code/FightingGuide/code/Fighting-guide-expo/node_modules/expo-modules-core/android/.cxx)

Manually remove the corrupted build state.

## Verification Plan

### Automated Tests
- Run `:expo-modules-core:buildCMakeRelWithDebInfo` to ensure the build no longer loops and completes successfully.

### Manual Verification
- Verify that Android Studio sync still works (the `generateStubPCH` task should still run for Debug).
