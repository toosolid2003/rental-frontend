// src/lib/getPaymentDetails.ts
import { gql, request } from "graphql-request";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const EAS_GRAPHQL_URL = "https://sepolia.easscan.org/graphql";

interface AttestationResponse {
    attestation?: {
      id: string;
      attester: string;
      data: string;
    };
  }

export async function getPaymentDetails(attestationId: string) {
  const query = gql`
    query GetAttestation($id: ID!) {
      attestation(where: { id: "0xf34eee5b9ce93e3af6ef1074f87da2c34b79223a4d4c69173034823e93afb245" }) {
        id
        data
      }
    }
  `;

  const variables = { id: attestationId };

  const response = await request<AttestationResponse>(EAS_GRAPHQL_URL, query, variables);

  if (!response?.attestation?.data) return null;

  const schemaEncoder = new SchemaEncoder(
    "address tenant,uint64 amount,bool on_time,uint256 month_year"
  );

  const decoded = schemaEncoder.decodeData(response.attestation.data);
  const decodedObj = Object.fromEntries(
    decoded.map((f: any) => {
      // if f.value is an object with 'value' field, unwrap it
      const value = typeof f.value === "object" && f.value !== null && "value" in f.value ? f.value.value : f.value;
      return [f.name, value];
    })
  );

  return {
    tenant: decodedObj.tenant,
    amount: Number(decodedObj.amount),
    on_time: Boolean(decodedObj.on_time),
    month_year: Number(decodedObj.month_year),
  };
}