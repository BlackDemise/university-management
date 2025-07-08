import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function ExcelUploader() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const [headerRow, ...dataRows] = parsedData;

      setHeaders(headerRow);
      setData(dataRows);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    // Map rows to objects using headers
    const objects = data.map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] ?? ""]))
    );

    try {
      const response = await axios.post(
        "http://localhost:8080/api/excel/import",
        objects
      );
      alert("Imported successfully!");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      {data.length > 0 && (
        <>
          <table border="1">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {headers.map((_, j) => (
                    <td key={j}>{row[j]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
}

export default ExcelUploader;
