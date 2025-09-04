
import { getPaymentDetails } from "./eas.server";
import { request } from "graphql-request";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";


// eas.server.test.ts

jest.mock("graphql-request");
jest.mock("@ethereum-attestation-service/eas-sdk");

describe("getPaymentDetails", () => {
  const mockRequest = request as jest.MockedFunction<typeof request>;
  const mockDecodeData = jest.fn();
  const mockSchemaEncoder = SchemaEncoder as jest.MockedClass<typeof SchemaEncoder>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSchemaEncoder.mockImplementation(() => ({
      decodeData: mockDecodeData,
    } as any));
  });

  it("returns decoded payment details when attestation data exists", async () => {
    mockRequest.mockResolvedValue({
      attestation: {
        id: "0x123",
        attester: "0xabc",
        helper: "",
        data: "0xdeadbeef",
      },
    });

    mockDecodeData.mockReturnValue([
      { name: "tenant", value: "0xTENANT" },
      { name: "amount", value: "1000" },
      { name: "on_time", value: true },
      { name: "month_year", value: 1717977600 },
    ]);

    const result = await getPaymentDetails("0x123");
    expect(result).toEqual({
      tenant: "0xTENANT",
      amount: "1000",
      on_time: true,
      month_year: 1717977600,
    });
    expect(mockRequest).toHaveBeenCalled();
    expect(mockDecodeData).toHaveBeenCalledWith("0xdeadbeef");
  });

  it("returns null if no attestation data", async () => {
    mockRequest.mockResolvedValue({ attestation: undefined });

    const result = await getPaymentDetails("0x123");
    expect(result).toBeNull();
  });

  it("returns null if attestation exists but data is missing", async () => {
    mockRequest.mockResolvedValue({ attestation: { id: "0x123", attester: "0xabc", helper: "", data: undefined as any } });

    const result = await getPaymentDetails("0x123");
    expect(result).toBeNull();
  });
});