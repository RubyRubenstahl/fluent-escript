const createScript = require("./index");
const { createServer } = require("../server");

const server = createServer();

const script = createScript("testScript")
  .cueRecord(0, "I should be deleted when cuelistDeleteAllCues is run")
  .cuelistDeleteAllCues(0)

  .cueRecord(0, "Newly Recoded Cue")

  .cueRecord(0, "New cue to be renamed")
  .cueSetName(0, 1, "Successfully renamed cue")

  .cueRecord(0, "My fade time should be")
  .cueSetFadeTime(0, 2, 5500)

  .cueRecord(0, "My mutex group ID should be 1")
  .cuelistSetMutexId(0, 1)

  .cuelistDeleteAllCues(1)
  .cueRecord(1, "This cuelist should be playing")
  .cuelistPlay(1)

  .cuelistSetName(1, "Test CuelistPlay")
  .cuelistDeleteAllCues(1)
  .cueRecord(1, "This cuelist should be playing")
  .cuelistPlay(1)

  .cuelistSetName(2, "Test CuelistStop")
  .cuelistDeleteAllCues(2)
  .cueRecord(2, "This cuelist should play then stop")
  .cuelistPlay(2)
  .cuelistStop(2)

  .cuelistSetName(3, "Test CuelistPause")
  .cuelistDeleteAllCues(3)
  .cueRecord(3, "This cuelist should play then pause")
  .cuelistPlay(3)
  .cuelistPause(3)

  .cuelistSetName(4, "Test gotoCue")
  .cuelistDeleteAllCues(4)
  .cueRecord(4, "Dummy")
  .cueRecord(4, "Dummy")
  .cueRecord(4, "This cue should be playing")
  .cuePlay(4, 2)

  .cuelistSetName(4, "Test gotoCue")
  .cuelistDeleteAllCues(4)
  .cueRecord(4, "Dummy")
  .cueRecord(4, "Dummy")
  .cueRecord(4, "This cue should be playing")
  .cuePlay(4, 2);
server.runScript(script);

console.log(script);
