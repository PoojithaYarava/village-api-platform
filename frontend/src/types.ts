export type Snapshot = {
  coverage: {
    country: { id: string; code: string; name: string };
    states: number;
    districts: number;
    subDistricts: number;
    villages: number;
  };
  performance: {
    p95ResponseMs: number;
    dailyCapacity: string;
    cacheHitRate: number;
  };
  plans: Array<{
    name: string;
    dailyLimit: number;
    regions: string;
  }>;
};

export type ApiResponse<T> = {
  success: boolean;
  count?: number;
  data: T;
  meta: {
    requestId: string;
    responseTime: number;
    rateLimit: {
      remaining: number;
      limit: number;
      reset: string;
    };
  };
};

export type VillageOption = {
  value: string;
  label: string;
  code?: string;
  fullAddress: string;
  hierarchy: {
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    country: string;
  };
};
