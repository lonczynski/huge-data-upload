export interface Chunk {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: ArrayBuffer;
  size: number;
}
