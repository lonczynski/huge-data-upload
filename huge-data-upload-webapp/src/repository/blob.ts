import axios from "axios";
import { env } from "../env";

export const getBlob = async (blobName: string) => {
  return await axios.get(`${env.api}/storage/containers/container-chunks/blobs/${blobName}`);
};

export const createBlob = async (fileName: string, fileExtension: string, start: any, end: any) => {
  return await axios({
    method: "post",
    url: `${env.api}/storage/containers/container-chunks/blobs/${fileName}`,
    data: {
      start,
      end,
      fileExtension,
    },
  });
};
