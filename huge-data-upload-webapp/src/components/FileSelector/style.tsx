import styled from "styled-components";

export const Box = styled.div`
  width: 600px;
  padding: 32px;
  margin: auto;
  margin-top: 120px;
  border: 1px solid grey;
  border-radius: 8px;
  box-shadow: -1px 2px 4px 0px rgba(67, 86, 100, 0.1), -4px 5px 8px 0px rgba(67, 86, 100, 0.12);
`;

export const Button = styled.button`
  width: 150px;
  height: 32px;
  background-color: #3d7edb;
  color: #ffffff;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  transition: 0.1s;
  font-weight: 400;
  cursor: pointer;

  &: hover {
    background-color: #1f4780;
  }
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 32px;
`;

export const FileNameInput = styled.input`
  margin-left: 16px;
  height: 28px;
`;
