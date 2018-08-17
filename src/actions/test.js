const createScript = require("./index");
const { createServer } = require("../server");

const server = createServer();

const script = createScript("testScript")
  .stopAll()
  .cueRecord(0, "I should be deleted when cuelistDeleteAllCues is run")
  .cuelistDeleteAllCues(0)

  .cuelistSetName(0, "Test QL/Q Settings")
  .cueRecord(0, "Newly Recoded Cue")

  .cueRecord(0, "New cue to be renamed")
  .cueSetName(0, 1, "Successfully renamed cue")

  .cueRecord(0, "My inFade time should be 5500 & outFade time should be 8675")
  .cueSetFadeTime(0, 2, 5500)
  .cueSetProperty(0, 2, "OutFadeTime", 8675)

  .cueRecord(0, "My mutex group ID should be 1")
  .cuelistSetMutexId(0, 1)

  .cueRecord(0, "This cue should get deleted")
  .cueDelete(0, 4)

  .cueRecord(0, "My cuelist priority should be 'very high'")
  .cuelistSetProperty(0, "Priority", 5)

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
  .cuePlay(4, 2)

  .cuelistSetName(5, "SHOULDBECOPIEDOVER")
  .cuelistDeleteAllCues(5)
  .cuelistCopy(0)
  .cuelistPaste(5)

  .cuelistSetName(6, "TestmutexStop")
  .cuelistDeleteAllCues(6)
  .cueRecord(6, "I should be stopped by mutex group")
  .cuelistSetMutexId(6, 1)
  .cuelistPlay(6)
  .mutexGroupStop(1)

  .cuelistSetName(7, "Test Skips")
  .cuelistDeleteAllCues(7)
  .cueRecord(7, "Dummy")
  .cueRecord(7, "I should be playing")
  .cueRecord(7, "Dummy")
  .cuelistSkipForward(7)
  .cuelistSkipForward(7)
  .cuelistSkipForward(7)
  .cuelistSkipBack(7)

  .fixtureSetRgb(0, 128, 128)
  .fixtureSetLevel(10)
  .setSubmasterValue(0, 2048);

server.runScript(script);

console.log(script);
