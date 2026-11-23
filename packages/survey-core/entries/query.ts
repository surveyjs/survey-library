// The public surface of "survey-core/query". It is a separate entry point on purpose: the renderers turn a
// read request into a server query, so only a server (or a client that talks OData) needs them, and an application
// that only renders a survey never loads any of it. A browser that sends the tree to a server in another language
// needs only toFilterTree from "survey-core". src/query/** reaches the library through the "survey-core" specifier,
// and entries/index.ts does not reference this file.

export type { IQueryField, IQueryOptions } from "../src/query/query-common";
export type { ISqlQueryOptions, ISqlQuery } from "../src/query/query-sql";
export { toSqlQuery } from "../src/query/query-sql";
export type { IMongoQuery } from "../src/query/query-mongo";
export { toMongoQuery } from "../src/query/query-mongo";
