const fs = require('fs');

const getRandom = () => {
  return Math.floor(Math.random() * 12) + 3;
};

const arr = [];

for (let i = 0; i <= 1000; i++) {
  arr.push([
    i,
    {
      width: getRandom(),
      height: getRandom(),
    },
  ]);
}

fs.writeFileSync('./data.json', JSON.stringify(arr));
