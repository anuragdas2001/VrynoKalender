import { gql } from "@apollo/client";

export const CHECK_SUBDOMAIN_QUERY = gql`
  query checkSubdomain($subdomain: String!) {
    checkSubdomain(subdomain: $subdomain) {
      status
      code
      message
      messageKey
    }
  }
`;
