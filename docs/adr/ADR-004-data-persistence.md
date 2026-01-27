# ADR-004: Data Persistence

## Status

Accepted

## Context

Following ADR-001's decision to adopt a Layered Architecture and ADR-002's project structure, we need to select a data persistence solution for FinTrack. The application requires local data storage for:

- **Transactions**: CRUD operations, filtering, sorting, date-based queries
- **Categories**: CRUD operations, custom and preset categories, sorting
- **Budgets**: CRUD operations, monthly budgets per category, progress tracking
- **User Settings**: App preferences, authentication state, UI preferences

Key requirements and constraints:

- **Platform**: React Native 0.83+ with New Architecture enabled
- **TypeScript**: Strict mode enabled, full type safety required
- **Performance**: Fast transaction entry (<500ms), smooth scrolling (≥55 FPS), efficient queries
- **Offline-first**: All data stored locally on device only (no cloud sync)
- **Data Privacy**: All data must remain on device, secure storage for sensitive data
- **Data Volume**: Expected to handle thousands of transactions over time
- **Relationships**: Transactions → Categories, Budgets → Categories (relational data)
- **Query Complexity**: Date ranges, filtering, grouping, aggregations (sums, counts)
- **Testability**: Database operations must be easily testable
- **Developer Experience**: Good TypeScript support, clear patterns, debugging tools
- **Team Readiness**: Solution should be maintainable and scalable

The application needs to handle:

- Complex queries (transactions by date range, category, type)
- Relationships between entities (transactions belong to categories)
- Aggregations (total expenses per category, budget progress)
- Fast writes (transaction entry must be <500ms)
- Efficient reads (smooth list scrolling with thousands of items)
- Data migrations (schema changes over time)
- Data export/import (CSV, JSON backup/restore)

## Considered Options

### Option A: RealmJS by MongoDB (Selected)

RealmJS is an object database designed for mobile applications. It provides a reactive, object-oriented data model with automatic synchronization capabilities (though we'll use it offline-only).

- ✅ Excellent performance (faster than SQLite for object operations)
- ✅ Object-oriented data model (natural fit for TypeScript/JavaScript)
- ✅ Built-in reactivity (live queries, automatic UI updates)
- ✅ Strong TypeScript support with schema definitions
- ✅ ACID transactions
- ✅ Relationship support (embedded objects, lists, links)
- ✅ Encryption support for sensitive data
- ✅ Good documentation and community
- ✅ Works well with React Native New Architecture
- ✅ Efficient query engine (indexed queries)
- ✅ Built-in migration system
- ✅ Small bundle size (~2MB)
- ❌ Learning curve (different from SQL)
- ❌ Less familiar to developers with SQL background
- ❌ Schema changes require migrations
- ❌ Limited SQL-like query capabilities
- ❌ Object database model may not fit all use cases

### Option B: WatermelonDB

WatermelonDB is a reactive database framework built on SQLite, designed for React and React Native applications with a focus on performance and scalability.

- ✅ Built on SQLite (familiar SQL queries)
- ✅ Excellent performance (lazy loading, optimized queries)
- ✅ Reactive queries (automatic UI updates)
- ✅ Strong TypeScript support
- ✅ Good documentation
- ✅ Designed for React Native
- ✅ Supports complex queries (SQL)
- ✅ Relationship support
- ✅ Migration system
- ✅ Small bundle size (~50kb + SQLite)
- ❌ More setup complexity
- ❌ Requires understanding of both SQL and WatermelonDB patterns
- ❌ Smaller community than Realm
- ❌ Less mature than Realm
- ❌ More boilerplate for simple operations

### Option C: MMKV

MMKV is a high-performance key-value storage framework developed by WeChat. It's extremely fast but designed for simple key-value storage.

- ✅ Extremely fast (faster than AsyncStorage by 30-50x)
- ✅ Very small bundle size (~50kb)
- ✅ Simple API
- ✅ Good TypeScript support
- ✅ Encryption support
- ✅ Works with React Native
- ❌ Key-value only (no relationships)
- ❌ No query capabilities (must load all data)
- ❌ No complex queries (filtering, sorting must be done in memory)
- ❌ Not suitable for relational data
- ❌ Manual serialization/deserialization required
- ❌ No migration system
- ❌ Poor fit for complex data structures
- ❌ Performance degrades with large datasets (must load everything)

### Option D: SQLite (react-native-sqlite-storage / better-sqlite3)

Direct SQLite integration using native SQLite libraries.

- ✅ Familiar SQL syntax
- ✅ Excellent performance
- ✅ Mature and battle-tested
- ✅ Supports complex queries
- ✅ Relationship support (JOINs)
- ✅ ACID transactions
- ✅ Small bundle size (SQLite is built-in on most platforms)
- ✅ Good for developers with SQL background
- ❌ Requires manual SQL query writing
- ❌ No built-in reactivity (must manually update UI)
- ❌ More boilerplate for CRUD operations
- ❌ Type safety requires manual type definitions
- ❌ Migration management must be handled manually
- ❌ Less React Native-specific optimizations
- ❌ No automatic UI synchronization

### Option E: AsyncStorage

React Native's built-in key-value storage solution.

- ✅ Built into React Native (no dependencies)
- ✅ Simple API
- ✅ Familiar to React Native developers
- ❌ Very slow (asynchronous, not optimized for performance)
- ❌ Key-value only (no relationships, no queries)
- ❌ No complex queries
- ❌ Not suitable for large datasets
- ❌ Performance issues with frequent reads/writes
- ❌ No type safety
- ❌ No migration system
- ❌ Not recommended for production apps with complex data

## Library Evaluation Matrix

| Criterion                    | RealmJS         | WatermelonDB      | MMKV            | SQLite           | AsyncStorage   |
| ---------------------------- | --------------- | ----------------- | --------------- | ---------------- | -------------- |
| **License**                  | Apache 2.0 ✅   | MIT ✅            | BSD 3-Clause ✅ | Public Domain ✅ | MIT ✅         |
| **Last Release**             | 1 month ✅      | 2 months ✅       | 2 weeks ✅      | Active ✅        | Active ✅      |
| **GitHub Stars**             | 5.1k ✅         | 10.5k ✅          | 16.2k ✅        | Various          | N/A (RN core)  |
| **Bundle Size**              | ~2MB ⚠️         | ~50kb + SQLite ✅ | ~50kb ✅        | ~500kb ⚠️        | 0kb ✅         |
| **TypeScript Support**       | Excellent ✅    | Excellent ✅      | Good ✅         | Manual ⚠️        | Limited ⚠️     |
| **New Arch Support**         | Yes ✅          | Yes ✅            | Yes ✅          | Yes ✅           | Yes ✅         |
| **Documentation**            | Excellent ✅    | Good ✅           | Good ✅         | Good ✅          | Basic ⚠️       |
| **Performance (Reads)**      | Excellent ✅    | Excellent ✅      | Excellent ✅    | Excellent ✅     | Poor ❌        |
| **Performance (Writes)**     | Excellent ✅    | Excellent ✅      | Excellent ✅    | Excellent ✅     | Poor ❌        |
| **Query Capabilities**       | Good ✅         | Excellent ✅      | None ❌         | Excellent ✅     | None ❌        |
| **Relationships**            | Excellent ✅    | Excellent ✅      | None ❌         | Excellent ✅     | None ❌        |
| **Reactivity**               | Built-in ✅     | Built-in ✅       | None ❌         | Manual ❌        | None ❌        |
| **Learning Curve**           | Medium ⚠️       | Medium ⚠️         | Low ✅          | Medium ⚠️        | Low ✅         |
| **Team Familiarity**         | Medium ⚠️       | Low ❌            | Low ❌          | High ✅          | High ✅        |
| **Scalability**              | Excellent ✅    | Excellent ✅      | Poor ❌         | Excellent ✅     | Poor ❌        |
| **Migration Support**        | Built-in ✅     | Built-in ✅       | Manual ❌       | Manual ❌        | Manual ❌      |
| **Encryption**               | Built-in ✅     | Manual ⚠️         | Built-in ✅     | Manual ⚠️        | None ❌        |
| **Offline-first**            | Excellent ✅    | Excellent ✅      | Excellent ✅    | Excellent ✅     | Excellent ✅   |
| **Testability**              | Good ✅         | Good ✅           | Good ✅         | Good ✅          | Good ✅        |
| **Ecosystem**                | Medium ⚠️       | Small ⚠️          | Small ⚠️        | Large ✅         | N/A            |
| **React Native Optimized**   | Excellent ✅    | Excellent ✅      | Good ✅         | Good ✅          | Built-in ✅    |
| **Object Model**             | Native ✅       | SQL-based ⚠️      | Key-value ❌    | SQL-based ⚠️     | Key-value ❌   |
| **Complex Queries**          | Good ✅         | Excellent ✅      | None ❌         | Excellent ✅     | None ❌        |
| **Data Export/Import**       | Good ✅         | Good ✅           | Manual ⚠️       | Good ✅          | Manual ⚠️      |
| ---------------------------- | --------------  | --------------    | --------------  | --------------   | -------------- |
| **Decision**                 | ✅ **Selected** | ❌                | ❌              | ❌               | ❌             |

## Decision

We will adopt **RealmJS by MongoDB** for data persistence in FinTrack.

## Rationale

RealmJS was selected for the following reasons:

1. **Performance**: Faster than SQLite for object operations, meeting the <500ms transaction entry requirement
2. **Object-Oriented Model**: Natural fit for TypeScript/JavaScript, aligns with our TypeScript-first approach
3. **Reactivity**: Built-in reactive queries enable automatic UI updates when data changes, reducing manual state synchronization
4. **TypeScript Support**: Strong TypeScript support with schema definitions and type inference
5. **Relationships**: Native support for relationships between entities (Transactions → Categories, Budgets → Categories)
6. **React Native Optimized**: Designed specifically for mobile applications with React Native optimizations
7. **Encryption**: Built-in encryption support for sensitive data (authentication tokens, user preferences)
8. **Migration System**: Built-in migration system for handling schema changes over time
9. **Developer Experience**: Good documentation, clear patterns, and debugging tools
10. **Offline-first**: Perfect fit for offline-only data storage requirement
11. **Query Performance**: Efficient indexed queries for fast filtering and sorting
12. **React Integration**: Built-in React hooks (`useQuery`, `useObject`) provide automatic reactivity

While RealmJS has a learning curve and is less familiar to SQL developers, these trade-offs are acceptable given:

- The object-oriented model aligns better with TypeScript/JavaScript development
- Built-in reactivity reduces complexity in state management
- Performance meets all requirements
- The learning curve is manageable with good documentation
- The solution is well-suited for mobile React Native applications

For detailed implementation guide, see [RealmJS Implementation Guide](../guides/realmjs-implementation-guide.md).

## Consequences

### Positive

1. **Performance**: Excellent performance for reads and writes, meeting all performance requirements
2. **Reactivity**: Built-in reactive queries enable automatic UI updates
3. **Type Safety**: Strong TypeScript support with schema definitions
4. **Developer Experience**: Good documentation, clear patterns, debugging tools
5. **Relationships**: Native support for relationships between entities
6. **Offline-first**: Perfect fit for offline-only requirement
7. **Encryption**: Built-in encryption for sensitive data
8. **Migration Support**: Built-in migration system for schema changes
9. **Query Performance**: Efficient indexed queries for fast filtering and sorting
10. **Object Model**: Natural fit for TypeScript/JavaScript development
11. **React Native Optimized**: Designed specifically for mobile applications

### Negative / Trade-offs

1. **Learning Curve**: Different from SQL, requires learning Realm's query syntax
   - **Mitigation**: Comprehensive documentation, examples, team training
2. **Bundle Size**: Larger bundle size (~2MB) compared to lighter solutions
   - **Mitigation**: Bundle size is acceptable for the benefits provided. Can optimize later if needed.
3. **Schema Changes**: Schema changes require migrations
   - **Mitigation**: Use Realm's built-in migration system, plan schema changes carefully
4. **SQL Familiarity**: Less familiar to developers with SQL background
   - **Mitigation**: Documentation, examples, and training sessions
5. **Query Limitations**: Some complex SQL queries may not be directly supported
   - **Mitigation**: Realm queries are sufficient for our use cases. Complex aggregations can be done in services layer.
6. **Object Database Model**: May not fit all use cases (though it fits our needs well)
   - **Mitigation**: Evaluate on a case-by-case basis. Most use cases fit the object model well.

### Risks and Mitigations

| Risk                        | Impact | Mitigation                                                                                        |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| Learning curve for team     | Medium | Comprehensive documentation, examples, code reviews, training sessions                            |
| Schema migration complexity | Medium | Plan migrations carefully, test migrations thoroughly, document migration process                 |
| Performance with large data | Low    | Use indexes, optimize queries, monitor performance, consider pagination for large lists           |
| Bundle size concerns        | Low    | Monitor bundle size, optimize if needed, consider code splitting                                  |
| Query limitations           | Low    | Evaluate query needs early, use services layer for complex operations, leverage Realm's strengths |
| Team unfamiliarity          | Low    | Documentation, examples, code reviews, pair programming sessions                                  |

## When to Revisit

This decision should be reconsidered if:

- Performance requirements cannot be met despite optimizations
- Schema complexity grows beyond Realm's capabilities
- Team consistently struggles with Realm patterns despite training
- Bundle size becomes a critical concern
- Query requirements become too complex for Realm's query language
- A better data persistence solution emerges that better fits the project's needs
- Project requirements change significantly (e.g., cloud sync, real-time collaboration)
- Migration complexity becomes unmanageable

## References

- [ADR-001: Architectural Approach](./ADR-001-high-level-architecture.md) - High-level architecture decision
- [ADR-002: Project Structure](./ADR-002-project-structure.md) - Project structure decision
- [ADR-003: State Management](./ADR-003-state-management.md) - State management decision
- [RealmJS Documentation](https://www.mongodb.com/docs/realm/sdk/react-native/) - Official RealmJS documentation
- [RealmJS TypeScript Guide](https://www.mongodb.com/docs/realm/sdk/react-native/examples/define-a-realm-object-model/) - TypeScript integration guide
- [RealmJS Performance Best Practices](https://www.mongodb.com/docs/realm/sdk/react-native/performance/) - Performance optimization guide
- [RealmJS Migrations](https://www.mongodb.com/docs/realm/sdk/react-native/examples/modify-an-object-schema/) - Schema migration guide
- [RealmJS Implementation Guide](../guides/realmjs-implementation-guide.md) - Detailed implementation guide
- [WatermelonDB Documentation](https://watermelondb.dev/) - Alternative solution documentation
- [MMKV Documentation](https://github.com/Tencent/MMKV) - MMKV documentation
- [React Native SQLite](https://github.com/andpor/react-native-sqlite-storage) - SQLite integration
- Project Specification: `fintrack-spec-en.md`
- Project PRD: `fintrack-prd-en.md`
