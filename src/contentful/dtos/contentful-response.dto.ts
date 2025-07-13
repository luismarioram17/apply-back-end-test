export class ContentfulResponseDto<T> {
  total: number;
  limit: number;
  items: ContentfulItemDto<T>[];
}

export class ContentfulItemDto<T> {
  metadata: object;
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: T;
}
