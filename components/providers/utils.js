const fs = require('fs');
const glob = require('glob');
// import glob from 'glob';


function findFiles(startPath, filter) {
  console.log('findFiles is now TRIGGERED!');
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(startPath)) {
      console.log("HERE IN FS.EXISTS SYNC")
      reject('Path not found: ' + startPath);
      return;
    }
    console.log("PATH IS FOUND!")

    const files = glob.sync(startPath + filter);
    console.log("FILE:", files[0])
    resolve(files[0]);

    // glob(startPath + filter, {}, (err, files) => {
    //   console.log("IN GLOB") // {PROBLEM HERE}
    //   if (err) {
    //     reject(err);
    //     return;
    //   }

    //   if (!files || !files.length) {
    //     reject('No such file found...');
    //     return;
    //   }
    //   console.log(files[0])
    //   resolve(files[0]);
    // });
    console.log("AFTER GLOB")
  });
}

function handleConnect(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Successfully connected to db...');
}

function handleClose(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log('Closed db connection.');
}


module.exports = {
  findFiles,
  handleConnect,
  handleClose
};
