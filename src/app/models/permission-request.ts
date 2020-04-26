import { PermissionScope } from '@airgap/beacon-sdk';

export class PermissionRequest {
  constructor(public readonly scope: PermissionScope[], public appID: string) {}
}
