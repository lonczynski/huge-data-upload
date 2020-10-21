import axios from "axios";
import { env } from "../env";

export const getBlobConnectionString = async () => {
  const { data: connectionString } = await axios.get<{ connectionString: string }>(
    `${env.api}/config/blobs/connection-string`
  );
  return connectionString;
};
