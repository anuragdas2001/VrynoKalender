import { gql } from "@apollo/client";

export const GET_WIDGET_DATA = gql`
  query getWidgetData($id: String) {
    getWidgetData(id: $id) {
      status
      data {
        data
      }
      code
      message
      messageKey
    }
  }
`;
