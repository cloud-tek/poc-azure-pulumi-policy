// Copyright 2016-2022, Pulumi Corporation.  All rights reserved.

import * as azure from "@pulumi/azure-native";
import * as policy from "@pulumi/policy";

const azureAlwaysFailPolicy: policy.ResourceValidationPolicy = {
  name: "azure-always-fail-policy",
  description: "Ensures that Azure resources have a 'cloud' tag with the value 'azure'.",
  enforcementLevel: "mandatory",
  validateResource: policy.validateResourceOfType(azure.resources.Resource, (resource, args, reportViolation) => {
    reportViolation(`This policy always fails: [${resource}]`, args.urn);
  }),
};

export const policies = new policy.PolicyPack("azure-always-fail", {
  policies: [azureAlwaysFailPolicy],
});




// import {
//   PolicyPack,
//   validateResourceOfType,
//   remediateResourceOfType,
// } from "@pulumi/policy";

// const policies = new PolicyPack("azure-always-fail", {
//   policies: [
//     {
//       name: "azure-always-fail-policy",
//       description: "Always fails",
//       enforcementLevel: "mandatory",
//       validateResource: validateResourceOfType(azure.resources.Resource, (resource, args, reportViolation) => {
//         throw new Error(`This policy always fails: [${resource}]`);
//         //reportViolation(`This policy always fails: [${resource}]`, args.urn);
//       })
//     }
//   ],
// });
