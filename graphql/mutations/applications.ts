import { gql } from "@apollo/client";
import {
  GenericMutationResponse,
  ISetupServiceResponse,
} from "../../models/shared";

export interface SetupServiceData {
  setupService: GenericMutationResponse<ISetupServiceResponse>;
}

export interface SetupServiceVars {
  isSample: Boolean;
}

export const SETUP_SERVICE_MUTATION = gql`
  mutation setupService {
    setupService {
      status
      code
      message
      messageKey
      data {
        permissionKey
        roleKey
        instanceId
      }
    }
  }
`;
