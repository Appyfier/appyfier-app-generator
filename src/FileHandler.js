const fs = require("fs-extra");

class FileHandler {
  replaceText(sourcePath, originalTextOrRejex, newText) {
    return new Promise((resolve, reject) => {
      fs.readFile(sourcePath, "utf8", function(err, data) {
        if (err) {
          return reject({ error: "Failed to read file" });
        }
        const result = data.replace(originalTextOrRejex, newText);
        fs.writeFile(sourcePath, result, "utf8", function(err) {
          if (err) {
            return reject({ error: "Failed to write file" });
          }
          return resolve({ success: "Replaced text in files successfully" });
        });
      });
    });
  }

  copyFiles(source, destination) {
    return new Promise((resolve, reject) => {
      fs.copy(source, destination, async err => {
        if (err) {
          return reject({ error: "Failed to copy file" });
        }
        return resolve({ success: "Copied files successfully" });
      });
    });
  }
}

export default new FileHandler();
