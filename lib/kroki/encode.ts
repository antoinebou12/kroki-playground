import pako from "pako";

function textEncode(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/** Kroki-compatible deflate + base64url (no padding). */
export function encodeDiagramPayload(source: string): string {
  const compressed = pako.deflate(textEncode(source), { level: 9 });
  return bytesToBase64Url(compressed);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(bytes).toString("base64")
      : binaryToBase64(bytes);
  return base64.replace(/\+/g, "-").replace(/\//g, "_");
}

function binaryToBase64(bytes: Uint8Array): string {
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(
      null,
      sub as unknown as number[],
    );
  }
  return btoa(binary);
}

/** Decode `source` query param (base64url + deflate) back to diagram text. */
export function decodeDiagramPayloadFromUrlParam(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const base64 = padded + "=".repeat(padLen);
  const binaryString = atob(base64);
  const charCodes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    charCodes[i] = binaryString.charCodeAt(i);
  }
  return pako.inflate(charCodes, { to: "string" });
}
