import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["src/**/*.tsx"],
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/gql/": {
      preset: "client",
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
