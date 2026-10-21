import { defineConfig, type UserConfig } from "tsdown";

const config: UserConfig = defineConfig({
  entry: {
    index: "src/index.ts",
    date: "src/date/index.ts",
    http: "src/http/index.ts",
    password: "src/password/index.ts",
    "password.node": "src/password/index.node.ts",
  },
  format: "esm",
  target: "es2022",
  dts: true,
  treeshake: true,
  clean: true,
  minify: true,
});

export default config;
