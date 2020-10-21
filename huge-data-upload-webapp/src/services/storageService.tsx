import { BlockBlobClient } from "@azure/storage-blob";
import streamSaver from "streamsaver";
import { createBlob, getBlob } from "../repository/blob";
import { getBlobConnectionString } from "../repository/config";

const AMOUNT_REQUESTS = 8;

class StorageService {
  public async download(fileName: string, setDownloadPercentage: Function) {
    const {
      data: {
        blobs: response,
        fileName: downloadedFileName,
        fileExtension: downloadedFileExtension,
      },
    } = await getBlob(fileName);

    const urls = response
      .sort((a: any, b: any) => (a.startAt > b.startAt ? 1 : -1))
      .map((m: any) => m.blobUrl);

    const fileStream = streamSaver.createWriteStream(
      `${downloadedFileName}.${downloadedFileExtension}`
    );
    const writeStream = fileStream.getWriter();

    setDownloadPercentage(0);

    const { connectionString } = await getBlobConnectionString();

    for (let i = 0; i < urls.length; i++) {
      const blobUrl = urls[i];

      try {
        const blobClient = new BlockBlobClient(`${blobUrl}?${connectionString}`);
        const blob = await blobClient.download(0);
        const blobBody = await blob.blobBody;
        // @ts-ignore
        const reader = blobBody?.stream().getReader();

        if (blobBody && reader) {
          setDownloadPercentage(Math.round(((i + 1) / urls.length) * 100));

          let pump = async () => {
            const { value, done } = await reader.read();

            if (!done) {
              await writeStream.write(value);
              await pump();
            } else {
            }
          };

          await pump();
        } else {
          --i;
        }
      } catch (e) {
        --i;
        console.log(e);
      }
    }

    setDownloadPercentage(null);
    writeStream.close();
  }

  public processFile(inputElementRef: any, fileName: string, setUploadPercentage: Function) {
    let file = inputElementRef.files[0];
    let size = file.size;
    //let sliceSize = 2097152; //2mb
    let sliceSize = 524288; //512kb
    let start = 0;
    let self = this;
    let pieces: any[] = [];
    const fileExtension = this.getFileExtension(file);

    async function loop() {
      let end = start + sliceSize;

      if (size - end < 0) {
        end = size;
      }

      let piece = self.slice(file, start, end);
      console.log(piece, start, end);

      pieces.push({
        piece,
        start,
        end,
      });

      if (end < size) {
        start += sliceSize;
        setTimeout(loop, 1);
      } else {
        self.makeCalls(pieces, fileName, fileExtension, setUploadPercentage);
      }
    }

    setTimeout(loop, 1);
  }

  private async makeCalls(
    pieces: any[],
    fileName: string,
    fileExtension: string,
    setUploadPercentage: Function
  ) {
    let chunk = function (arr: any[], chunkSize: number) {
      var R: any[] = [];
      for (var i = 0; i < arr.length; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
      return R;
    };

    let piecesAsChunks = chunk(pieces, AMOUNT_REQUESTS);
    let totalSent = 0;

    const { connectionString } = await getBlobConnectionString();

    setUploadPercentage(0);
    for (const pieceAsChunk of piecesAsChunks) {
      await Promise.all(
        pieceAsChunk.map(({ piece, start, end }: any) => {
          return this.send(piece, start, end, fileName, fileExtension, connectionString);
        })
      );

      totalSent++;

      setUploadPercentage((totalSent / piecesAsChunks.length) * 100);
    }

    setUploadPercentage(null);
  }

  private slice(file: any, start: any, end: any) {
    let slice = file.mozSlice
      ? file.mozSlice
      : file.webkitSlice
      ? file.webkitSlice
      : file.slice
      ? file.slice
      : () => {};

    return slice.bind(file)(start, end);
  }

  private async send(
    piece: Blob,
    start: any,
    end: any,
    fileName: string,
    fileExtension: string,
    connectionString: string,
    tries: number = 0
  ): Promise<void> {
    if (tries > 10) throw "uploadError";
    try {
      const {
        data: { url: blobUrl },
      } = await createBlob(fileName, fileExtension, start, end);

      const blobClient = new BlockBlobClient(`${blobUrl}?${connectionString}`);

      const buffer = await piece.arrayBuffer();

      await blobClient.upload(buffer, buffer.byteLength);
    } catch {
      await this.send(piece, start, end, fileName, fileExtension, connectionString, ++tries);
    }
  }

  private getFileExtension(file: any): string {
    const { name: fileNameWithExtension } = file;

    const nameSplitted = fileNameWithExtension.split(".");
    return nameSplitted[nameSplitted.length - 1];
  }
}

export default StorageService;
