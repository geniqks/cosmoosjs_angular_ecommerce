import $RefParser from 'json-schema-ref-parser';
import { NgOpenApiGen } from 'ng-openapi-gen';
import { Options } from 'ng-openapi-gen/lib/options';

const options: Options = {
  input: "scripts/openapi/openapi-declaration.json",
  output: "src/app/api",
}

// load the openapi-spec and resolve all $refs
// @ts-ignore
const RefParser = new $RefParser();
const openApi = await RefParser.bundle(options.input, {
  dereference: { circular: false }
});

const ngOpenGen = new NgOpenApiGen(openApi, options);
ngOpenGen.generate();