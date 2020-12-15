import fs from "fs";
import csvParse from "csv-parse";
import _ from "lodash";
import Table from "cli-table";

interface Record {
  date: string;
  areaType: string;
  areaCode: string;
  areaName: string;
  newCasesBySpecimenDateRollingRate: string;
  alertLevel: string;
}

const program = async () => {
  const csv = await fs.promises.readFile("input.csv");

  const [records] = await new Promise<[Record[], csvParse.Info]>(
    (resolve, reject) =>
      csvParse(csv, { columns: true }, (err, records, info) => {
        if (err) {
          reject(err);
        } else {
          resolve([records, info]);
        }
      })
  );

  const filteredRecords = _.chain(records)
    // Only england
    .filter((record) => record.areaCode.startsWith("E"))
    // Only most recent rate
    .groupBy((record) => record.areaCode)
    .map((groupedRecords) => {
      const result = _.sortBy(
        groupedRecords,
        (groupedRecord) => groupedRecord.date
      )
        .reverse()
        .find(
          (groupedRecord) =>
            groupedRecord.newCasesBySpecimenDateRollingRate !== "" &&
            parseFloat(groupedRecord.newCasesBySpecimenDateRollingRate) !== 0
        );
      return result;
    })
    .compact()
    // Sort from lowest to highest
    .sortBy((record) => parseFloat(record.newCasesBySpecimenDateRollingRate))
    .value();

  const table = new Table({
    head: ["Pos", "Name", "Rate per 100k"],
  });
  filteredRecords.forEach((record, index) => {
    table.push([
      index + 1,
      record.areaName,
      record.newCasesBySpecimenDateRollingRate,
    ]);
  });
  console.log(table.toString());
  console.log(filteredRecords[0].date);
};
program();
