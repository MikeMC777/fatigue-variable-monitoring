export interface VariableI {
  id?: number,
  _uuid?: string,
  name: string,
  data_type: string,
  has_range_for_age?: boolean;
  measurement_unit: string,
  status: boolean
}

export interface VariableRangeI {
  id?: number,
  _uuid?: string,
  variable_id: number,
  min_age: number,
  max_age: number,
  min_range: number,
  max_range: number
}
