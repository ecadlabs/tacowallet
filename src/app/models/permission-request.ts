export type PermissionScope = "read_address" | "sign" | "payment_request" | "threshold";

export class PermissionRequest {
  constructor(public readonly scope: PermissionScope, public appID: string) {

  }
}
