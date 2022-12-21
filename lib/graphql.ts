import { gql } from "graphql-request";

export const getNFT = (id: number) => gql`
    {
      nftEntity(id: "${id}") {
        owner
        nftId
        offchainData
        rentalContract {
          hasStarted
          renter
          rentee
        }
      }
    }
  `;
