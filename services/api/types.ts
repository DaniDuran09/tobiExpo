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