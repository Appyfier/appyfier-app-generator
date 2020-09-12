const exec = require("child_process").exec;

class CommandExecuter {
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, data) => {
        if (err) {
          console.log(err);
          return reject({ error: "Failed to execute command " + command });
        }
        console.log(data);
        return resolve({ success: "Executed command successfully " + command });
      });
    });
  }
}

export default new CommandExecuter();
