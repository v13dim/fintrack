# Service Conventions

All business logic services in `src/services/` are implemented as **classes with static methods**. This convention ensures a consistent API and makes it clear that services are stateless namespaces.

## Rule

- **Every service is a class** (e.g. `OnboardingStorageService`, `SecureStorageService`).
- Methods are **static** — no instance state; the class is a grouping of related functions.
- Export the **class** from the module so callers can use `ServiceName.method()`.
- Optionally export **function wrappers** that delegate to the class for backward compatibility or convenience (e.g. `getOnboardingCompleted` → `OnboardingStorageService.getOnboardingCompleted()`).

## Structure

```typescript
// src/services/exampleService/exampleService.ts

export class ExampleService {
  static async getItem(): Promise<Item | null> {
    // ...
  }

  static async setItem(item: Item): Promise<void> {
    // ...
  }
}

// Backward-compatible function exports (optional)
export const getItem = ExampleService.getItem.bind(ExampleService);
export const setItem = ExampleService.setItem.bind(ExampleService);
```

## Naming

- **File**: `serviceNameService.ts` (camelCase + "Service"), e.g. `onboardingStorageService.ts`.
- **Class**: `PascalCaseService`, e.g. `OnboardingStorageService`, `SecureStorageService`.

## Adding a New Service

1. Create folder `src/services/serviceNameService/`.
2. Create the implementation file `serviceNameService.ts` with a class and static methods.
3. Export the class and any function wrappers from `serviceNameService/index.ts`.
4. Export from `src/services/index.ts`.
5. Add `__tests__/` and, if needed, `__mocks__/` following the module structure pattern.

## References

- `.cursorrules` — "Service Structure" and "Adding a new service"
- Existing examples: `OnboardingStorageService`, `SecureStorageService`
