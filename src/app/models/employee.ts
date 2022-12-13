export interface EmployeeI {
  id?: number,
  _uuid?: string,
  name: string,
  second_name: string,
  surname: string,
  second_surname: string,
  document_type: string,
  document: number,
  address: string,
  phone: string,
  cellphone: string,
  position: string,
  date_of_birth: Date,
  height: number,
  weight: number,
  email: string
}

export interface EmployeeDeviceI {
  id?: number,
  _uuid?: string,
  employee_id: number,
  device_id: number,
  device_name?: string
}
