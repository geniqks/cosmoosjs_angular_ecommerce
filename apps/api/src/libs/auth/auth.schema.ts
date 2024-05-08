import { OpenapiFactory } from "@cosmoosjs/hono-openapi";
import type { user } from "@prisma/client";

export const AuthRegisterInputSchema = OpenapiFactory.generateSchema<user>({
  schemaName: 'AuthRegisterInputSchema',
  params: [
    {
      name: 'username',
      required: true,
      type: 'string',
    },
    {
      name: 'name',
      required: true,
      type: 'string',
    },
    {
      name: 'lastname',
      required: true,
      type: 'string',
    },
    {
      name: 'email',
      required: true,
      type: 'string',
      rules: [
        {
          functionName: 'email',
        }
      ]
    },
    {
      name: 'password',
      required: true,
      type: 'string',
    }
  ]
})