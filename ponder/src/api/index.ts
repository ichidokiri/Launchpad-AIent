import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";

const app = new Hono();

/**
 * @dev use the client to interact with the database
 */
app.use("/sql/*", client({ db, schema }));

/**
 * @dev use the graphql to interact with the database
 */
app.use("/", graphql({ db, schema }));

export default app;
