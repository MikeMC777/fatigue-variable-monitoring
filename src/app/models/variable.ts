export interface VariableI {
  id?: number,
  _uuid?: string,
  name: string,
  data_type: string,
  measurement_unit: string,
  min_range: number,
  max_range: number,
  status: boolean
}
