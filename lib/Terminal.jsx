import React, { useEffect } from "react";
import Terminal from "xterm";

function TerminalComponent() {
  let term = new Terminal();
  useEffect(() => {
    term.open(document.getElementById("terminal"), false);
    let shellprompt = "$ ";

    term.prompt = function () {
      term.write("\r\n" + shellprompt);
    };

    term.writeln("welcome to xterm.js");
    term.writeln("This is a local terminal emulation, without a real terminal in the back-end.");
    term.writeln("Type some keys and commands to play around. but only clear cmd is working :)");
    term.writeln("");
    term.prompt();
    term.setOption("cursorBlink", true);

    let cmd = "";

    term.on("key", function (key, ev) {
      let printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode == 13) {
        if (cmd === "clear") {
          term.clear();
        }
        cmd = "";
        term.prompt();
      } else if (ev.keyCode == 8) {
        // Do not delete the prompt
        console.log(term.rows);
        if (term.x > 2) {
          term.write("\b \b");
        }
      } else if (printable) {
        cmd += key;
        term.write(key);
      }
    });

    term.on("paste", function (data, ev) {
      term.write(data);
    });
  }, []);

  return <div id="terminal"/>;
}

export default TerminalComponent;
