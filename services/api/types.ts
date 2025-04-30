interface ApiResponse<T> {
  code: number;
  data: T;
  method: string;
  request_id: string;
  request_ip: string;
  service: string;
  status: boolean;
  url: string;
}

interface Notification {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}