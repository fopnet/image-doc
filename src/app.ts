const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
import { hello } from "./hello";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => hello().catch(handleError) };

const app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));

const handleError = (error: Error) => {
    // let errorMessage: string = `${error.name}: ${error.message}`;
    const errorMessage: string = `${error.message}`;
    console.error(error);
    return Promise.reject(new Error(errorMessage));
};
