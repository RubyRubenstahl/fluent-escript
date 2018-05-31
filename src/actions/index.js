const Programmer = function ({ transport }){
  this.actions = [];
  this.transport = transport;
  return this;
};

Programmer.prototype.cuelistPlay = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTSTART",
    params: [cuelistIndex]
  });
  return this;
};

Programmer.prototype.cuelistStop = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTSTOP",
    params: [cuelistIndex]
  });
  return this;
};

Programmer.prototype.cuePlay = function(cuelistIndex, cueIndex, jump = true){
  this.actions.push({
    command: "CUELISTSTOP",
    params: [index]
  });
  return this;
};

 Programmer.prototype.cuelistDeleteAllCues = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTDELETEALLCUES",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.mutexGroupStop = function(mutexId){
  this.actions.push({
    command: "CUELISTMUTEXRELEASE",
    params: [mutexId]
  });
  return this;
}

 Programmer.prototype.cuelistSkipBack = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTSKIPBACKWARD",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.cuelistSkipForward = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTSKIPFORWARD",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.cuelistSetMutexId = function(cuelistIndex, mutexId){
  this.actions.push({
    command: "SETMUTEXID",
    params: [cuelistIndex, mutexId]
  });
  return this;
}

 Programmer.prototype.setSubmasterValue = function(cuelistIndex, value){
  this.actions.push({
    command: "SETCUELISTSUBMASTERVALUE",
    params: [cuelistIndex, value]
  });
  return this;
}

 Programmer.prototype.cuelistCopy = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTCOPY",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.cuelistPaste = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTPASTE",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.cuelistSetName = function(cuelistIndex, name){
  this.actions.push({
    command: "CUELISTSETNAME",
    params: []
  });
  return this;
};

 Programmer.prototype.cuelistPause = function(cuelistIndex){
  this.actions.push({
    command: "CUELISTPAUSE",
    params: [cuelistIndex]
  });
  return this;
}

 Programmer.prototype.stopAll = function(){
  this.actions.push({
    command: "CUELISTSTOPALL",
    params: []
  });
  return this;
}

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "CUELISTSETPROPERTY",
    params: []
  });
  return this;
} */

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "CUESETPROPERTY",
    params: []
  });
  return this;
} */

 Programmer.prototype.cueDelete = function(cuelistIndex, cueIndex){
  this.actions.push({
    command: "DELETECUE",
    params: [cuelistIndex, cueIndex]
  });
  return this;
}

 Programmer.prototype.cueSetName = function(cuelistIndex, cueIndex, name){
  this.actions.push({
    command: "SETCUENAME",
    params: [cuelistIndex, cueIndex, name]
  });
  return this;
}

 Programmer.prototype.cueRecord = function(cuelistIndex, name){
  this.actions.push({
    command: "RECORDCUE",
    params: [cuelistIndex, name]
  });
  return this;
}

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "SETLEVEL",
    params: []
  });
  return this;
} */

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "SETRGBW",
    params: []
  });
  return this;
} */

 Programmer.prototype.proClear = function(){
  this.actions.push({
    command: "PROCLEAR",
    params: []
  });
  return this;
}

 Programmer.prototype.grpUse = function(groupName, expand=false){
  this.actions.push({
    command: "GRPUSE",
    params: [groupName, expand]
  });
  return this;
}

 Programmer.prototype.grpCreate = function(name, selectedOnly=true){
  this.actions.push({
    command: "GRPCREATE",
    params: [name, selectedOnly]
  });
  return this;
}

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "SETSWITCHSTATE",
    params: []
  });
  return this;
} */

 Programmer.prototype.vmSetLevel = function(vmIndex, value){
  this.actions.push({
    command: "VMSETLEVEL",
    params: [vmIndex, value]
  });
  return this;
}

 Programmer.prototype.mediaContinue = function(playerIndex){
  this.actions.push({
    command: "MEDIACONTINUE",
    params: [playerIndex]
  });
  return this;
}

 Programmer.prototype.mediaPause = function(playerIndex){
  this.actions.push({
    command: "MEDIAPAUSE",
    params: [playerIndex]
  });
  return this;
}

 Programmer.mediaPlay = function(playerIndex, filePath, repeat=true, fullscreen=false){
  this.actions.push({
    command: "MEDIAPLAY",
    params: [playerIndex, repeat | fullscreen, filePath]
  });
  return this;
}

 Programmer.prototype.mediaSetVolume = function(playerIndex, value){
  this.actions.push({
    command: "MEDIASETVOLUME",
    params: [playerIndex, value]
  });
  return this;
}

 Programmer.prototype.mediaStop = function(playerIndex){
  this.actions.push({
    command: "MEDIASTOP",
    params: [playerIndex]
  });
  return this;
}

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "GETCUELISTS",
    params: []
  });
  return this;
} */

/* Programmer.prototype.xxxx = function(){
  this.actions.push({
    command: "GETSHOWSTATE",
    params: []
  });
  return this;
} */




Programmer.prototype.run = function(){
  this.actions.map(action => this.transport(action));
};

module.exports = Programmer;
