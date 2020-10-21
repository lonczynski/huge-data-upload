import React, { SyntheticEvent, useState } from "react";
import StorageService from "../../services/storageService";
// @ts-ignore
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import { Box, Button, Title, FileNameInput } from "./style";

function FileSelector() {
  const [uploadFileName, setUploadFileName] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const [downloadPercentage, setDownloadPercentage] = useState(null);

  const storageService = new StorageService();

  const onFileSelected = (event: SyntheticEvent) => {
    storageService.processFile(event.target, uploadFileName, setUploadPercentage);
  };

  const onDownloadButtonClicked = async () => {
    await storageService.download(downloadFileName, setDownloadPercentage);
  };

  return (
    <>
      <Box>
        <Title>Upload new file</Title>
        <div>
          File name:
          <FileNameInput
            value={uploadFileName}
            onChange={({ target: { value } }) => setUploadFileName(value)}
          ></FileNameInput>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <input type="file" name="file" onChange={onFileSelected} />
        </div>
        {uploadPercentage && <Progress percent={uploadPercentage} />}
      </Box>
      <Box>
        <Title>Download</Title>
        <div style={{ marginBottom: 16 }}>
          File name:
          <FileNameInput
            value={downloadFileName}
            onChange={({ target: { value } }) => setDownloadFileName(value)}
          ></FileNameInput>
          <Button style={{ marginLeft: 32 }} onClick={onDownloadButtonClicked}>
            Download File
          </Button>
        </div>
        {downloadPercentage && <Progress percent={downloadPercentage} />}
      </Box>
    </>
  );
}

export default FileSelector;
