import fs from "fs-extra";
import { exec } from "child_process";
import emptyTrash from "empty-trash";

class ApkCleaner {
  clean(rootDir) {
    const GeneratedApksPath = rootDir + "/public/GeneratedApks";
    setInterval(() => {
      fs.readdir(GeneratedApksPath, (err, data) => {
        if (err) {
          return;
        }
        const toBeDeleted = [];
        const directories = data.filter(d => d.indexOf(".") == -1);
        console.log("Directories", directories);
        directories.forEach(dir => {
          const diff = Date.now() - dir.split("-")[1];
          console.log(diff / 60000);
          if (diff / 60000 > 6) {
            toBeDeleted.push(dir);
          }
        });
        toBeDeleted.forEach(dir => {
          exec(`cd ${GeneratedApksPath} && rm -rf ${dir}`);
        });
      });
    }, 1000 * 60);
  }

  trashCleaner() {
    setInterval(async () => {
      await emptyTrash();
    }, 86400 / 2);
  }
}

export default new ApkCleaner();
