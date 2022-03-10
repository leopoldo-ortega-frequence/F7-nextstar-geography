// export const ageData = [
//   { name: "under 18", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "18-25", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "25-35", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "35-45", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "45-55", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "55-65", value: Math.floor(Math.random() * 12) + 1 },
//   { name: "65+", value: Math.floor(Math.random() * 12) + 1 },
//];

export const colors = [
  {
    primary: "#1769aa",
    secondary: "#2196f3",
  },
  {
    primary: "#aa2e25",
    secondary: "#f44336",
  },
  {
    primary: "#357a38",
    secondary: "#4caf50",
  },
  {
    primary: "#482880",
    secondary: "#673ab7",
  },
  {
    primary: "#b26a00",
    secondary: "#ff9800",
  },
  {
    primary: "#00695f",
    secondary: "#009688",
  },
];

function randombetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generate(max, numCount, keys) {
  var r = [];
  const newData = [];
  var currsum = 0;
  for (var i = 0; i < numCount - 1; i++) {
    r[i] = randombetween(1, max - (numCount - i - 1) - currsum);
    currsum += r[i];
  }
  r[numCount - 1] = max - currsum;

  for (let i = 0; i < keys.length; i++) {
    let newObj = {};
    newObj["name"] = keys[i];
    newObj["value"] = r[i];
    newData.push(newObj);
  }
  return newData;
}

export const deviceData = generate(100, 3, [
  "desktop",
  "smart phone",
  "tablet",
]);

export const incomeData = generate(100, 4, [
  "0-50k",
  "50k-100k",
  "100k-150k",
  "150k+",
]);

export const ageData = generate(20, 7, [
  "under 18",
  "18-25",
  "25-35",
  "35-45",
  "45-55",
  "55-65",
  "65+",
]);

export const compData = generate(100, 5, [
  "caucasian",
  "Asians",
  "Hispanics",
  "Others",
  "African Americans",
]);
