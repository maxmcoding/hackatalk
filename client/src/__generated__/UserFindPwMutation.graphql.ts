/**
 * @generated SignedSource<<b566f448699f209cd17b16f0a12567ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UserFindPwMutation$variables = {
  email: string;
};
export type UserFindPwMutation$data = {
  readonly findPassword: boolean;
};
export type UserFindPwMutation = {
  variables: UserFindPwMutation$variables;
  response: UserFindPwMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      }
    ],
    "kind": "ScalarField",
    "name": "findPassword",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserFindPwMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserFindPwMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "dfc25d419209a80d1c8ded8e2b043693",
    "id": null,
    "metadata": {},
    "name": "UserFindPwMutation",
    "operationKind": "mutation",
    "text": "mutation UserFindPwMutation(\n  $email: String!\n) {\n  findPassword(email: $email)\n}\n"
  }
};
})();

(node as any).hash = "9911a45920167b82d3c49c3ae8ade091";

export default node;
