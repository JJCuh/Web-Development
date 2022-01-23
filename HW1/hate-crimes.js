/*
  Q3) The two valid compare options are name and median_income.
   
  Q4) When I re-ran the program with name as the compare option, it produced the table of states and their associated data, 
  with the states in alphabetical order.
*/

// (1) @task Import the fs library and assign it to a variable called fs
const process = require("process");
const path = require("path");
const fs = require("fs");

// (2) @task Create a variable called FILE_NAME and assign it the
// string value of hate-crimes.csv
const FILE_NAME = "./hate-crimes.csv";

const Row = function () {
  return {
    name: "",
    median_income: 0,
    unemployed_seasonal_percent: 0,
    metro_dwellers_percent: 0,
    high_school_grad_percent: 0,
    non_citizen_percent: 0,
    poor_white_percent: 0,
    gini_index: 0,
    non_white_percent: 0,
    trump_voter_percent: 0,
    crimes_splc: 0,
    crimes_fbi: 0,
  };
};

const read_data = function (rows) {
  // (3) Create a mutable variable data
  let data;
  try {
    data = fs.readFileSync(FILE_NAME, "utf-8");
  } catch (e) {
    console.log("Error opening file" + e);
    process.exit(1);
  }

  const lines = data.split("\n");
  // skip through heading line by starting at index 1
  for (let i = 1; i < lines.length; i++) {
    const row = Row();
    const rawData = lines[i].split(",");

    // ew we can do better than this
    row.name = rawData[0];
    row.median_income = parseInt(rawData[1], 10);
    row.unemployed_seasonal_percent = parseFloat(rawData[2], 10);
    row.metro_dwellers_percent = parseFloat(rawData[3], 10);
    row.high_school_grad_percent = parseFloat(rawData[4], 10);
    row.non_citizen_percent = parseFloat(rawData[5], 10);
    row.poor_white_percent = parseFloat(rawData[6], 10);
    row.gini_index = parseFloat(rawData[7], 10);
    row.non_white_percent = parseFloat(rawData[8], 10);
    row.trump_voter_percent = parseFloat(rawData[9], 10);
    row.crimes_splc = parseFloat(rawData[10], 10);
    row.crimes_fbi = parseFloat(rawData[11], 10);

    // insert another element into the array
    rows.push(row);
  }
};

const print_usage = function () {
  console.log("\nUSAGE\n---\n");
  console.log(`${path.basename(process.argv[1])} <compare_field>`);
  console.log("\t compare_field - name | median_income");
};

const main = function () {
  if (process.argv.length < 3) {
    console.log("No argument provided for sorting.");
    print_usage();
    process.exit(2);
  }

  // (4) @task Create an empty array called rows
  const rows = [];
  read_data(rows);

  const defaultRow = Row();
  const option = process.argv[2];
  if (defaultRow.hasOwnProperty(option)) {
    rows.sort(function (a, b) {
      return b[option] - a[option];
    });
  } else {
    console.log(`Unknown option for compare_field: ${option}`);
    print_usage();
    process.exit(1);
  }

  console.log(`${"STATE".padEnd(20)}\tINCOME\tSPLC\tFBI`);
  console.log("-".repeat(45));
  // (5) @task Complete the for loop using the condition that
  // the loop variable must be less than the expression rows.length
  for (let i = 0; i < rows.length; i++) {
    const row = [
      rows[i].name.padEnd(20),
      // access the median_income property of an element in the array
      rows[i].median_income,
      rows[i].crimes_splc.toFixed(2),
      // access the crimes_fbi property of an element and
      // set it to be a fixed with of two
      rows[i].crimes_fbi.toFixed(2),
    ].join("\t");

    console.log(row);
  }
};

// (6) Call the function known as main
main();
