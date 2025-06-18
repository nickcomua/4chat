import { Effect, Schema } from "effect";

// Define error types for different PouchDB put failures
export class PouchDBPutError extends Schema.TaggedError<PouchDBPutError>()("PouchDBPutError", {
    message: Schema.String,
    status: Schema.optional(Schema.Number),
    docId: Schema.optional(Schema.String),
    docRev: Schema.optional(Schema.String),
    error: Schema.optional(Schema.String),
}) { }

export class DocumentConflictError extends Schema.TaggedError<DocumentConflictError>()("DocumentConflictError", {
    message: Schema.String,
    docId: Schema.String,
    docRev: Schema.String,
}) { }

export class InvalidDocumentError extends Schema.TaggedError<InvalidDocumentError>()("InvalidDocumentError", {
    message: Schema.String,
    docId: Schema.optional(Schema.String),
}) { }

// Define the success response schema for put operation
const PutResponseSchema = Schema.Struct({
    ok: Schema.Boolean,
    id: Schema.String,
    rev: Schema.String
});

type PutResponse = typeof PutResponseSchema.Type;



/**
 * Creates an Effect that performs a put operation on a PouchDB database.
 * 
 * @param db - The PouchDB instance
 * @param doc - The document to put into the database
 * @returns An Effect that resolves to the put response or fails with appropriate error
 */
export const putDocument = <T extends {}>(
    db: PouchDB.Database<T>,
    doc: T
): Effect.Effect<PutResponse, PouchDBPutError | DocumentConflictError | InvalidDocumentError> => {
    return Effect.tryPromise({
        try: () => db.put(doc),
        catch: (error) => {
            // Type guard for PouchDB errors
            const isPouchError = (err: unknown): err is PouchDB.Core.Error => {
                return typeof err === "object" && err !== null && "status" in err;
            };

            if (!isPouchError(error)) {
                return new PouchDBPutError({
                    message: "Unknown error occurred during put operation",
                    // @ts-ignore
                    docId: doc._id,
                    error: String(error)
                });
            }

            // Handle specific error cases
            switch (error.name) {
                case "conflict":
                    return new DocumentConflictError({
                        // @ts-ignore
                        message: `Document update conflict for id: ${doc._id}`,
                        // @ts-ignore
                        docId: doc._id,
                        // @ts-ignore
                        docRev: doc._rev || "unknown"
                    });

                case "invalid_id":
                    return new InvalidDocumentError({
                        // @ts-ignore
                        message: `Invalid document ID: ${doc._id}`,
                        // @ts-ignore
                        docId: doc._id
                    });

                case "missing_id":
                    return new InvalidDocumentError({
                        message: "Document is missing _id field"
                    });

                case "missing_rev":
                    return new InvalidDocumentError({
                        message: `Document is missing _rev field for update operation`,
                        // @ts-ignore
                        docId: doc._id
                    });

                default:
                    return new PouchDBPutError({
                        message: error.message || "Unknown database error",
                        status: error.status,
                        // @ts-ignore
                        docId: doc._id,
                        // @ts-ignore
                        docRev: doc._rev
                    });
            }
        }
    }).pipe(
        Effect.withSpan("putDocument", {
            attributes: {
                db: db.name,
                // @ts-ignore
                docId: doc._id,
                // @ts-ignore
                docRev: doc._rev
            }
        })
    )
};