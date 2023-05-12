export interface UploadedFileI {
  id?: number,
  _uuid?: string,
  device_id: number;
  plot_sent_id: number;
  employee_id: number;
  variable_id: number;
  value: number;
  registered_at: string;
  exceeds_range: boolean;
}
