import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";
import { performance } from "perf_hooks";

import ApkCleaner from "./ApkCleaner";
import CommandExecuter from "./CommandExecuter";
import FileHandler from "./FileHandler";

const app = express();
const port = 3000;
const rootDir = path.resolve(__dirname + "/../");
const android = `${rootDir}/baseApp/android`;
const predefinedTimeout = 40000;
let timeout = 0;

app.use(express.static("public"));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

ApkCleaner.clean(rootDir);
ApkCleaner.trashCleaner();

app.get("/", (req, res) => res.status(200).json({ message: "Api working." }));

app.post("/generate-app", validateApi, queueAPICall, async (req, res) => {
  const t0 = performance.now();
  const name = `${req.body.name}`;
  const projId = req.body.projId;
  const url = req.body.url;
  const versionCode = req.body.versionCode;
  const versionName = req.body.versionName;
  const folderName = name.replace(/\s/g, "") + "-" + Date.now();

  // Icon
  const iconMDPI = req.files ? req.files.iconMDPI : undefined;
  const iconHDPI = req.files ? req.files.iconHDPI : undefined;
  const iconXHDPI = req.files ? req.files.iconXHDPI : undefined;
  const iconXXHDPI = req.files ? req.files.iconXXHDPI : undefined;
  const iconXXXHDPI = req.files ? req.files.iconXXXHDPI : undefined;
  // Splash
  const splashMDPI = req.files ? req.files.splashMDPI : undefined;
  const splashHDPI = req.files ? req.files.splashHDPI : undefined;
  const splashXHDPI = req.files ? req.files.splashXHDPI : undefined;
  const splashXXHDPI = req.files ? req.files.splashXXHDPI : undefined;
  const splashXXXHDPI = req.files ? req.files.splashXXXHDPI : undefined;

  try {
    await CommandExecuter.executeCommand(
      `cd ${rootDir}/public/GeneratedApks && mkdir ${folderName}`
    );

    await CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory && mkdir ${folderName}`
    );

    await CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory/${folderName} && mkdir android`
    );

    await FileHandler.copyFiles(
      android,
      `${rootDir}/process_directory/${folderName}/android`
    );
    const t1 = performance.now();
    console.log(
      "Time taken to clone project..... (in Seconds)" + (t1 - t0) / 1000
    );

    await CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory/${folderName} && react-native-rename ${name} -b ${projId}`
    );

    await FileHandler.replaceText(
      `${rootDir}/process_directory/${folderName}/android/app/src/main/res/layout/activity_main.xml`,
      "com.techlive.appyfier",
      projId
    );

    await FileHandler.replaceText(
      `${rootDir}/process_directory/${folderName}/android/app/src/main/res/layout/activity_splash.xml`,
      "com.techlive.appyfier",
      projId
    );

    const folders = projId.split(".");
    await FileHandler.replaceText(
      `${rootDir}/process_directory/${folderName}/android/app/src/main/java/${folders[0]}/${folders[1]}/${folders[2]}/MainActivity.kt`,
      "com.techlive.appyfier",
      projId
    );

    await FileHandler.replaceText(
      `${rootDir}/process_directory/${folderName}/android/app/src/main/java/${folders[0]}/${folders[1]}/${folders[2]}/SplashActivity.kt`,
      "com.techlive.appyfier",
      projId
    );

    await FileHandler.replaceText(
      `${rootDir}/process_directory/${folderName}/android/app/src/main/java/${folders[0]}/${folders[1]}/${folders[2]}/MainActivity.kt`,
      /https:\/\/www\.google\.com/g,
      url
    );

    if (versionName) {
      await FileHandler.replaceText(
        `${rootDir}/process_directory/${folderName}/android/app/build.gradle`,
        "versionCode 1",
        `versionCode ${versionCode}`
      );
    }
    if (versionName) {
      await FileHandler.replaceText(
        `${rootDir}/process_directory/${folderName}/android/app/build.gradle`,
        'versionName "1.0"',
        `versionName "${versionName}"`
      );
    }

    if (splashMDPI) {
      splashMDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/drawable-mdpi/launch_screen.png`,
        err => console.log(err)
      );
    }
    if (splashHDPI) {
      splashHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/drawable-hdpi/launch_screen.png`,
        err => console.log(err)
      );
    }
    if (splashXHDPI) {
      splashXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/drawable-xhdpi/launch_screen.png`,
        err => console.log(err)
      );
    }
    if (splashXXHDPI) {
      splashXXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/drawable-xxhdpi/launch_screen.png`,
        err => console.log(err)
      );
    }
    if (splashXXXHDPI) {
      splashXXXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/drawable-xxxhdpi/launch_screen.png`,
        err => console.log(err)
      );
    }

    if (iconMDPI) {
      iconMDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/mipmap-mdpi/ic_launcher.png`,
        err => console.log(err)
      );
    }
    if (iconHDPI) {
      iconHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/mipmap-hdpi/ic_launcher.png`,
        err => console.log(err)
      );
    }
    if (iconXHDPI) {
      iconXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`,
        err => console.log(err)
      );
    }
    if (iconXXHDPI) {
      iconXXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`,
        err => console.log(err)
      );
    }
    if (iconXXXHDPI) {
      iconXXXHDPI.mv(
        `${rootDir}/process_directory/${folderName}/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`,
        err => console.log(err)
      );
    }

    await CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory/${folderName}/android && ./gradlew assembleRelease`
    );
    await CommandExecuter.executeCommand(
      `cp ${rootDir}/process_directory/${folderName}/android/app/build/outputs/apk/release/* ${rootDir}/public/GeneratedApks/${folderName}`
    );
    CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory && rm -rf ${folderName} && cd ${rootDir}`
    );
    const t2 = performance.now();
    console.log("Time taken..... (in Seconds)" + (t2 - t0) / 1000);
    timeout = timeout - predefinedTimeout > 0 ? timeout - predefinedTimeout : 0;
    return res.status(200).json({
      downloadUrlPath: `http://localhost:${port}/GeneratedApks/${folderName}/app-release.apk`
    });
  } catch (error) {
    console.log(error);
    CommandExecuter.executeCommand(
      `cd ${rootDir}/process_directory && rm -rf ${folderName} && cd ${rootDir}`
    );
    timeout = timeout - predefinedTimeout > 0 ? timeout - predefinedTimeout : 0;
    return res.status(500).json({ message: "Server Error." });
  }
});

function queueAPICall(req, res, next) {
  if (timeout >= 120000) {
    return res.status(500).json({
      message:
        "We are experiencing a high traffic right now, please try again in a minute"
    });
  }
  setTimeout(function() {
    next();
  }, timeout);
  timeout = timeout + predefinedTimeout;
}

function validateApi(req, res, next) {
  const name = req.body.name;
  const projId = req.body.projId;
  const url = req.body.url;
  if (!name.trim()) {
    return res.status(400).json({ message: "App name is required." });
  }
  if (name.indexOf("Appyfier") > 0) {
    return res
      .status(400)
      .json({ message: "Please use a different app name." });
  }
  if (!projId.trim()) {
    return res.status(400).json({ message: "Bundle Id is required." });
  }
  if (projId) {
    const regex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i;
    if (!regex.test(projId)) {
      return res.status(400).json({
        message:
          "Bundle Id is invalid. Please enter bundle id in the form of com.example.app"
      });
    }
  }
  if (!url.trim()) {
    return res.status(400).json({ message: "Website url is required." });
  }
  if (url) {
    const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (!regex.test(url)) {
      return res.status(400).json({ message: "Website url is invalid." });
    }
  }
  next();
}

app.listen(port, () => console.log(`Appyfier app listening on port ${port}!`));
