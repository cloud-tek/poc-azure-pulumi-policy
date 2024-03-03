// Copyright 2016-2022, Pulumi Corporation.  All rights reserved.

import * as azure from "@pulumi/azure-native";
import {
  PolicyPack,
  validateResourceOfType,
  remediateResourceOfType,
} from "@pulumi/policy";

const policies = new PolicyPack("azure-tags", {
  policies: [
    {
      name: "azure-ensure-tag-policy",
      description:
        "Ensures that Azure resources have a 'environment' & 'project' tags",
      enforcementLevel: "mandatory",
      validateResource: validateResourceOfType(
        azure.resources.Resource,
        (resource, args, reportViolation) => {
          const tags = args.props.tags;
          const requiredTags = ["environment", "project"];

          if (!tags) {
            reportViolation(
              `Resource [${resource}] is has no tags defined`,
              args.urn
            );

            return;
          }

          if (!tags.every((tag: string) => requiredTags.includes(tag))) {
            reportViolation(
              `Resource [${resource}] is missing the required 'environment' and 'project' tags.`, args.urn
            );

            return;
          }
        }
      ),
    },
    {
      name: "azure-remediate-tag-policy",
      description:
        "Ensures that Azure resources have a 'cloud' tag with the value 'azure'.",
      enforcementLevel: "remediate",
      remediateResource: remediateResourceOfType(
        azure.resources.Resource,
        (resource, args) => {
          if (!resource.tags || !resource.tags["cloud"]) {
            resource.tags = resource.tags || {};
            resource.tags["cloud"] = "azure";
          }
          return resource;
        }
      ),
    },
  ],
});