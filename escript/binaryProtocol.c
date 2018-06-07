// binaryProtocol script comment
printf("Starting UDP Command listener...\n");

int nBob;
nBob = BobAllocate(10000);
int packetLength;
int nPort;
string sIpAddress;
string sText;
int offset = 0;
int packetComplete = 0;
string action;
string actions[100];
int debug = 0;
createActionTable();

function OnUdp(int nDriverHandle){
	BobSetRange(nBob, 0, BobGetSize(nBob), 0);
	offset=0;
	packetComplete=0;
	packetLength = ReceiveFrom(nDriverHandle, nBob, sIpAddress, nPort);
    //printf("Received, length=%d\n", packetLength);
	if (packetLength <= 0){return;}
	//startNewResponse();
	processNextInstruction();
	//endResponse();
	//sendResponse();
}


function processNextInstruction(){
	int instruction;
	if(debug){printf("##################### NEW PACKET ######################\n");}
	while(!packetComplete){
		instruction = readNum(offset);
		if(instruction > (size(actions) - 1)){
			alert("Instruction code out of range: %d\n", instruction);
			return;
		}
		if(instruction == 0){
			packetComplete = 1;

		}
		else {
			action = actions[instruction];
			if(debug){printf("Instruction Code: %d\n", instruction);}
			if(debug){printf("Action: %s\n", action);}
			runAction(instruction);
		}
		if(debug){printf("\n");}
	}
	if(debug){printf("Packet completed - Final offset: %d\n", offset);}
	if(debug){printf("\n\n\n");}
}


function readNum(int readOffset){
	offset += 2;
	int value = BobGetAt16(nBob,readOffset);
	if(debug){printf("offset: %d, type: int16, value: %d\n", readOffset, value);}
	return value;
}

string sArg;
function readString(int readOffset){
	sArg = BobGetString(nBob,readOffset, 255);
	if(debug){printf("offset: %d, type: string, value: %s\n", readOffset, sArg);}
	offset += strlen(sArg)+1;
}




function runAction(int instructionCode){
	switch(instructionCode){
	  //PACKETID
	  case 1:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTDELETEALLCUES
	  case 2:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTMUTEXRELEASE
	  case 3:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTSKIPBACKWARD
	  case 4:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTSKIPBACKWARD
	  case 5:
		  notImplemented(instructionCode);
		  break;

	  //SETMUTEXID
	  case 6:
		  notImplemented(instructionCode);
		  break;

	  //SETCUELISTSUBMASTERVALUE
	  case 7:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTCOPY
	  case 8:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTPASTE
	  case 9:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTSETNAME
	  case 10:
		  notImplemented(instructionCode);
		  break;

	  //CUELISTSTART
	  case 11:
	      int index = readNum(offset);
		  CuelistStart(index)
		  break;

	  //CUELISTPAUSE
	  case 12:
		  int index = readNum(offset);
		  CuelistPause(index)
		  break;

	  //CUELISTSTOP
	  case 13:
		  int index = readNum(offset);
          CuelistStop(index)
		  break;

	  //CUELISTSTOPALL
	  case 14:
		  int index = readNum(offset);
          CuelistStopAll(index)
		  break;

	  //CUELISTSETPROPERTY
	  case 15:
		  notImplemented(instructionCode);
		  break;

	  //CUESETPROPERTY
	  case 16:
		  notImplemented(instructionCode);
		  break;

	  //DELETECUE
	  case 17:
		  notImplemented(instructionCode);
		  break;

	  //GOTOCUE
	  case 18:
		  notImplemented(instructionCode);
		  break;

	  //SETCUENAME
	  case 19:
		  notImplemented(instructionCode);
		  break;

	  //RECORDCUE
	  case 20:
		  notImplemented(instructionCode);
		  break;

	  //SETLEVEL
	  case 21:
		  notImplemented(instructionCode);
		  break;

	  //SETRGBW
	  case 22:
		  setRgbw();
		  break;

	  //PROCLEAR
	  case 23:
		  proClear();
		  break;

	  //GRPUSE
	  case 24:
	  	readString(offset);
	  	string groupName = sArg;
	  	int expand = readNum(offset);
	  	grpUse(groupName, expand);
	  	break;

	  //GRPCREATE
	  case 25:
		  notImplemented(instructionCode);
		  break;

	  //SETSWITCHSTATE
	  case 26:
		  notImplemented(instructionCode);
		  break;

	  //VMSETLEVEL
	  case 27:
		  int index=readNum(offset);
		  int level = readNum(offset);
		  VersatileMasterStartAutoFade(index, level, 200);
		  break;

	  //MEDIACONTINUE
	  case 28:
		  notImplemented(instructionCode);
		  break;

	  //MEDIAPAUSE
	  case 29:
		  notImplemented(instructionCode);
		  break;

	  //MEDIAPLAY
	  case 30:
		  notImplemented(instructionCode);
		  break;

	  //MEDIASETVOLUME
	  case 31:
		  notImplemented(instructionCode);
		  break;

	  //MEDIASTOP
	  case 32:
		  notImplemented(instructionCode);
		  break;

      //GETCUELISTS
      case 33:
          notImplemented(instructionCode);
          //Call("actionResponder", instructionCode);
          break;

      //GETSTATE
      case 34:
          //Call("actionResponder", instructionCode);
          notImplemented(instructionCode);
          break;
	}
}
function setRgbw(){
  int redRaw = readNum(offset);
  //printf("red: %d\n", redRaw);
  int redLevel = to24Bit(redRaw);
  SetPosition(redLevel);
  proLoadValue(2);


  int greenRaw = readNum(offset);
  //printf("green: %d\n", greenRaw);
  int greenLevel = to24Bit(greenRaw);
  SetPosition(greenLevel);
  proLoadValue(1);

  int blueRaw = readNum(offset);
  //printf("blue: %d\n", blueRaw);
  int blueLevel = to24Bit(blueRaw);
  SetPosition(blueLevel);
  proLoadValue(0);

  int whiteRaw = readNum(offset);
  //printf("white: %d\n", whiteRaw);
  int whiteLevel = to24Bit(whiteRaw);
  SetPosition(whiteLevel);
  proLoadValue(3);
  //printf("setRGBW Complete");
}

function notImplemented(int instructionCode){

	alert("Action not implemented: %s\n", actions[instructionCode]);
}

function to24Bit(int value){
  return ((value+1) *256)-1;
}

function createActionTable(){
	actions[0] = "EOF";
	actions[1] = "PACKETID";
	actions[2] = "CUELISTDELETEALLCUES";
	actions[3] = "CUELISTMUTEXRELEASE";
	actions[4] = "CUELISTSKIPBACKWARD";
	actions[5] = "CUELISTSKIPBACKWARD";
	actions[6] = "SETMUTEXID";
	actions[7] = "SETCUELISTSUBMASTERVALUE";
	actions[8] = "CUELISTCOPY";
	actions[9] = "CUELISTPASTE";
	actions[10] = "CUELISTSETNAME";
	actions[11] = "CUELISTSTART";
	actions[12] = "CUELISTPAUSE";
	actions[13] = "CUELISTSTOP";
	actions[14] = "CUELISTSTOPALL";
	actions[15] = "CUELISTSETPROPERTY";
	actions[16] = "CUESETPROPERTY";
	actions[17] = "DELETECUE";
	actions[18] = "GOTOCUE";
	actions[19] = "SETCUENAME";
	actions[20] = "RECORDCUE";
	actions[21] = "SETLEVEL";
	actions[22] = "SETRGBW";
	actions[23] = "PROCLEAR";
	actions[24] = "GRPUSE";
	actions[25] = "GRPCREATE";
	actions[26] = "SETSWITCHSTATE";
	actions[27] = "VMSETLEVEL";
	actions[28] = "MEDIACONTINUE";
	actions[29] = "MEDIAPAUSE";
	actions[30] = "MEDIAPLAY";
	actions[31] = "MEDIASETVOLUME";
	actions[32] = "MEDIASTOP";
	actions[33] = "GETCUELISTS";
	actions[34] = "GETSHOWSTATE";
}

RegisterEvent(UdpReceive, OnUdp);
Suspend();