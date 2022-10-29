export interface DeviceI {
    id?: number,
    _uuid?: string,
    reference: string,
    name: string,
    description: string,
    status: boolean
}

export interface AvailableDeviceI {
  id?: number,
  _uuid?: string,
  name: string
}
