const { tokenizeInstruction } = require("../lib");

const intBool = value => Boolean(value) ? 1 : 0;

const createScript = function (name) {
  this.actions = [];
  this.name = name;
  return this;
};

// Tokenize the instruction and push the action onto the action list.
createScript.prototype.pushAction = function (name, args, instructions) {
  this.actions.push({
    name,
    args,
    instructions,
    tokenized: tokenizeInstruction(instructions)
  });
};


/**
Plays the specified cuelist
@param cuelistIndex {number} - 0-based index of the cuelist to play.
@returns the script object.
*/
createScript.prototype.cuelistPlay = function (cuelistIndex) {
  this.pushAction(
    "cuelistPlay",
    { cuelistIndex },
    {
      command: "CUELISTSTART",
      params: [cuelistIndex]
    }
  );
  return this;
};

// Normalized from 0...4096 to 0...100
createScript.prototype.cuelistSetLevel = function (cuelist, level) {
  const scaledLevel = Math.round(level / 100 * 4096);

  this.pushAction(
    "cuelistSetLevel",
    { cuelist, level },
    {
      command: "CUELISTSETLEVEL",
      params: [cuelist, scaledLevel]
    }
  );
  return this;
};

createScript.prototype.cuelistSetCurrent = function (cuelist) {

  this.pushAction(
    "cuelistSetCurrent",
    { cuelist },
    {
      command: "CUELISTSETCURRENT",
      params: [cuelist]
    }
  );
  return this;
};

/**
Plays the specifed cue within the cuelist.
@param cuelistIndex {number}  - 0-based index of the cuelist to play.
*/

createScript.prototype.cuePlay = function (cuelistIndex, cueIndex, jump = true) {
  this.pushAction(
    "cuePlay",
    { cuelistIndex, cueIndex, jump },
    {
      command: "GOTOCUE",
      params: [cuelistIndex, cueIndex, jump]
    }
  );
  return this;
};

createScript.prototype.cuelistStop = function (cuelistIndex) {
  this.pushAction(
    "cuelistStop",
    { cuelistIndex },
    {
      command: "CUELISTSTOP",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.cueSetFadeTime = function (
  cuelistIndex,
  cueIndex,
  fadeTime
) {
  this.pushAction(
    "cueSetFadeTime",
    { cuelistIndex, cueIndex, fadeTime },
    {
      command: "CUESETFADETIME",
      params: [cuelistIndex, cueIndex, fadeTime]
    }
  );
  return this;
};

createScript.prototype.cuelistDeleteAllCues = function (cuelistIndex) {
  this.pushAction(
    "cuelistDeleteAllCues",
    { cuelistIndex },
    {
      command: "CUELISTDELETEALLCUES",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.resetCuelist = function (cuelistIndex) {
  this.pushAction(
    "resetCuelist",
    { cuelistIndex },
    {
      command: "RESETCUELIST",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.mutexGroupStop = function (mutexId) {
  this.pushAction(
    "mutexGroupStop",
    { mutexId },
    {
      command: "CUELISTMUTEXRELEASE",
      params: [mutexId]
    }
  );
  return this;
};

createScript.prototype.cuelistSkipBack = function (cuelistIndex) {
  this.pushAction(
    "cuelistSkipBack",
    { cuelistIndex },
    {
      command: "CUELISTSKIPBACKWARD",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.cuelistSkipForward = function (cuelistIndex) {
  this.pushAction(
    "cuelistSkipForward",
    { cuelistIndex },
    {
      command: "CUELISTSKIPFORWARD",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.cuelistSetMutexId = function (cuelistIndex, mutexId) {
  this.pushAction(
    "cuelistSetMutexId",
    { cuelistIndex, mutexId },
    {
      command: "SETMUTEXID",
      params: [cuelistIndex, mutexId]
    }
  );
  return this;
};

createScript.prototype.setSubmasterValue = function (cuelistIndex, value) {
  this.pushAction(
    "setSubmasterValue",
    { cuelistIndex, value },
    {
      command: "SETCUELISTSUBMASTERVALUE",
      params: [cuelistIndex, value]
    }
  );
  return this;
};

createScript.prototype.cuelistCopy = function (cuelistIndex) {
  this.pushAction(
    "cuelistCopy",
    { cuelistIndex },
    {
      command: "CUELISTCOPY",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.cuelistPaste = function (cuelistIndex) {
  this.pushAction(
    "cuelistPaste",
    { cuelistIndex },
    {
      command: "CUELISTPASTE",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.cuelistSetName = function (cuelistIndex, name) {
  this.pushAction(
    "cuelistSetName",
    { cuelistIndex, name },
    {
      command: "CUELISTSETNAME",
      params: [cuelistIndex, name]
    }
  );
  return this;
};

createScript.prototype.cuelistPause = function (cuelistIndex) {
  this.pushAction(
    "cuelistPause",
    { cuelistIndex },
    {
      command: "CUELISTPAUSE",
      params: [cuelistIndex]
    }
  );
  return this;
};

createScript.prototype.stopAll = function () {
  this.pushAction(
    "stopAll",
    {},
    {
      command: "CUELISTSTOPALL",
      params: []
    }
  );
  return this;
};

createScript.prototype.cuelistSetVmId = function (cuelistIndex, vmId) {
  return this.cuelistSetProperty(cuelistIndex, "ExtraSubMaster", vmId);
};

createScript.prototype.cuelistSetProperty = function (
  cuelistIndex,
  propertyName,
  value
) {
  this.pushAction(
    "cuelistSetProperty",
    { cuelistIndex, propertyName, value },
    {
      command: "CUELISTSETPROPERTY",
      params: [cuelistIndex, propertyName, value]
    }
  );
  return this;
};

createScript.prototype.cueSetProperty = function (
  cuelistIndex,
  cueIndex,
  propertyName,
  value
) {
  this.pushAction(
    "cueSetProperty",
    { cuelistIndex, cueIndex, propertyName, value },
    {
      command: "CUESETPROPERTY",
      params: [cuelistIndex, cueIndex, propertyName, value]
    }
  );
  return this;
};

createScript.prototype.cueDelete = function (cuelistIndex, cueIndex) {
  this.pushAction(
    "cueDelete",
    { cuelistIndex, cueIndex },
    {
      command: "DELETECUE",
      params: [cuelistIndex, cueIndex]
    }
  );
  return this;
};

createScript.prototype.cueSetName = function (cuelistIndex, cueIndex, name) {
  this.pushAction(
    "cueSetName",
    { cuelistIndex, cueIndex, name },
    {
      command: "SETCUENAME",
      params: [cuelistIndex, cueIndex, name]
    }
  );
  return this;
};

createScript.prototype.cueRecord = function (cuelistIndex, name) {
  this.pushAction(
    "cueRecord",
    { cuelistIndex, name },
    {
      command: "RECORDCUE",
      params: [cuelistIndex, name]
    }
  );
  return this;
};

createScript.prototype.fixtureSetRgb = function (r, g, b) {
  this.pushAction(
    "fixtureSetRgb",
    { r, g, b },
    {
      command: "SETRGB",
      params: [r, g, b]
    }
  );
  return this;
};

createScript.prototype.fixtureSetLevel = function (level) {
  this.pushAction(
    "fixtureSetLevel",
    { level },
    {
      command: "SETLEVEL",
      params: [level]
    }
  );
  return this;
};


createScript.prototype.proClear = function () {
  this.pushAction(
    "proClear",
    {},
    {
      command: "PROCLEAR",
      params: []
    }
  );
  return this;
};

createScript.prototype.grpUse = function (groupName, expand = false) {
  this.pushAction(
    "grpUse",
    { groupName, expand },
    {
      command: "GRPUSE",
      params: [groupName, expand]
    }
  );
  return this;
};

createScript.prototype.grpCreate = function (name, selectedOnly = true) {
  this.pushAction(
    "grpCreate",
    { name, selectedOnly },
    {
      command: "GRPCREATE",
      params: [name, selectedOnly]
    }
  );
  return this;
};


createScript.prototype.vmSetLevel = function (vmIndex, value, fadeTime = 100) {
  this.pushAction(
    "vmSetLevel",
    { vmIndex, value },
    {
      command: "VMSETLEVEL",
      params: [vmIndex, value, fadeTime]
    }
  );
  return this;
};

createScript.prototype.mediaContinue = function (playerIndex) {
  this.pushAction(
    "mediaContinue",
    { playerIndex },
    {
      command: "MEDIACONTINUE",
      params: [playerIndex]
    }
  );
  return this;
};

createScript.prototype.mediaPause = function (playerIndex) {
  this.pushAction(
    "mediaPause",
    { playerIndex },
    {
      command: "MEDIAPAUSE",
      params: [playerIndex]
    }
  );
  return this;
};

createScript.prototype.mediaPlay = function (
  playerIndex,
  filePath,
  repeat = true,
  fullscreen = false
) {
  // Run the mediaContinue action if no filepath was provided
  if (filePath === undefined) {
    return this.mediaContinue(playerIndex);
    1;
  }

  this.pushAction(
    "mediaPlay",
    { playerIndex, filePath, repeat, fullscreen },
    {
      command: "MEDIAPLAY",
      params: [playerIndex, repeat | fullscreen, filePath]
    }
  );
  return this;
};

createScript.prototype.mediaSetVolume = function (playerIndex, value) {
  this.pushAction(
    "mediaSetVolume",
    { playerIndex, value },
    {
      command: "MEDIASETVOLUME",
      params: [playerIndex, value]
    }
  );
  return this;
};

createScript.prototype.printf = function (message) {
  this.pushAction(
    "printf",
    { message },
    {
      command: "PRINTF",
      params: [message]
    }
  );
  return this;
};


createScript.prototype.setSwitchState = function (switchName, value) {
  this.pushAction(
    "setSwitchState",
    { playerIndex, delta },
    {
      command: "SETSWITCHSTATE",
      params: [switchName, intBool(value)]
    }
  );
  return this;
}

createScript.prototype.enableBlindMode = function () {
  return this.setSwitchState('blind', true);
};

createScript.prototype.disableBlindMode = function () {
  return this.setSwitchState('blind', false);
};

createScript.prototype.enableHighlightMode = function () {
  return this.setSwitchState('highlight', true);
};

createScript.prototype.disableHighlightMode = function () {
  return this.setSwitchState('highlight', false);
};

createScript.prototype.enableNetworkOutput = function () {
  return this.setSwitchState('network', true);
};

createScript.prototype.disableNetworkOutput = function () {
  return this.setSwitchState('network', false);
};

createScript.prototype.enableTriggers = function () {
  return this.setSwitchState('triggers', true);
};

createScript.prototype.disableTriggers = function () {
  return this.setSwitchState('triggers', false);
};


createScript.prototype.mediaVolumeDelta = function (playerIndex, delta) {
  this.pushAction(
    "mediaVolumeDelta",
    { playerIndex, delta },
    {
      command: "MEDIAVOLUMEDELTA",
      params: [playerIndex, delta]
    }
  );
  return this;
};




createScript.prototype.mediaSkip = function (playerIndex, delta) {
  this.pushAction(
    "mediaVolumeDelta",
    { playerIndex, delta },
    {
      command: "MEDIASKIP",
      params: [playerIndex, delta]
    }
  );
  return this;
};

createScript.prototype.mediaSkipForward = function (playerIndex) {
  return ths.mediaSkip(playerIndex, 1);
}

createScript.prototype.mediaSkipBacks = function (playerIndex) {
  return ths.mediaSkip(playerIndex, -1);
}


createScript.prototype.mediaSetColorCorrection = function (playerIndex, options, channel) {
  const { gamma = 0, contrast = 0, brightness = 0 } = options;
  this.pushAction(
    "mediaSetColorCorrection",
    { playerIndex, options },
    {
      command: "MEDIASETGAMMA",
      params: [playerIndex, contrast, brightness, gamma, channel]
    }
  );
  return this;
};


createScript.prototype.mediaStop = function (playerIndex) {
  this.pushAction(
    "mediaStop",
    { playerIndex },
    {
      command: "MEDIASTOP",
      params: [playerIndex]
    }
  );
  return this;
};

createScript.prototype.heartbeat = function(id) {
  this.pushAction(
    "heartbeat",
    { id },
    {
      command: "HEARTBEAT",
      params: [id]
    }
  );
  return this;
};

createScript.prototype.addFixture = function addFixture(fixtureType, screenName, screenId, sectionIndex, universe, address) {
  this.pushAction(
    "addFixture",
    { fixtureType, screenName, screenId, sectionIndex, universe, address },
    {
      command: "ADDFIXTURE",
      params: [fixtureType, screenName, screenId, sectionIndex, universe, address]
    }
  );
}

module.exports = name => new createScript(name);
