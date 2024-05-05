import { OpenapiFactory } from "@cosmoosjs/hono-openapi";

export const AuthSchema = OpenapiFactory.generateSchema({
  params: [
    {
      name: 'email',
      required: true,
      type: 'string',
    }
  ]
})