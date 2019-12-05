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
int packetId = 0;
int SUCCESS = 1;
int error;
createActionTable();
int instructionIndex = 0;
function OnUdp(int nDriverHandle)
{
	BobSetRange(nBob, 0, BobGetSize(nBob), 0);
	offset = 0;
	packetComplete = 0;
	packetLength = ReceiveFrom(nDriverHandle, nBob, sIpAddress, nPort);
	//printf("Received, length=%d\n", packetLength);
	if (packetLength <= 0)
	{
		return;
	}
	//startNewResponse();
	instructionIndex = 0;
	processNextInstruction();

	//endResponse();
	//sendResponse();
}

function processNextInstruction()
{
	int instruction;
	if (debug)
	{
		printf("##################### NEW PACKET ######################\n");
	}
	while (!packetComplete)
	{
		instruction = readNum(offset);
		if (instruction > (size(actions) - 1))
		{
			alert("Instruction code out of range: %d\n", instruction);
			return;
		}
		if (instruction == 0)
		{
			packetComplete = 1;
		}
		else
		{
			action = actions[instruction];
			if (debug)
			{
				printf("Instruction Code: %d\n", instruction);
				printf("Action: %s\n", action);
			}
			error = runAction(instruction);
			if (error)
			{
				alert("BCP Instruction Failed\n  code: %d\n  instructionINdex: %d\n  action: %s\n", instruction, instructionIndex, action);
			}
		}
		if (debug)
		{
			printf("\n");
		}
	}
	if (debug)
	{
		printf("Packet completed - Final offset: %d\n", offset);
		printf("\n\n\n");
	}
	instructionIndex++;
}

function readNum(int readOffset)
{
	offset += 2;
	int value = BobGetAt16(nBob, readOffset);
	if (debug)
	{
		printf("offset: %d, type: int16, value: %d\n", readOffset, value);
	}
	return value;
}

string sArg;
function readString(int readOffset)
{
	sArg = BobGetString(nBob, readOffset, 255);
	if (debug)
	{
		printf("offset: %d, type: string, value: %s\n", readOffset, sArg);
	}
	offset += strlen(sArg) + 1;
}

function runAction(int instructionCode)
{
	int result = -1;
	switch (instructionCode)
	{
	//PACKETID
	case 1:
		packetId = readNum(offset);
		result = SUCCESS;
		break;

	//CUELISTDELETEALLCUES
	case 2:
		int index = readNum(offset);
		int cueCount = CueGetCount(index);
		int i;
		for (i; i < cueCount; i++)
		{
			CueDelete(index, 0);
		}
		result = SUCCESS;
		break;

	//CUELISTMUTEXRELEASE
	case 3:
		int mutexId = readNum(offset);
		result = MutexRelease(mutexId);
		break;

	//CUELISTSKIPBACKWARD
	case 4:
		int index = readNum(offset);
		result = CuelistSkipBackward(index);
		break;

	//CUELISTSKIPFORWARD
	case 5:
		int index = readNum(offset);
		result = CuelistSkipForward(index);
		break;

	//SETMUTEXID
	case 6:
		int cuelistIndex = readNum(offset);
		int mutexId = readNum(offset);
		result = CuelistSetMutexId(cuelistIndex, mutexId);
		break;

	//SETCUELISTSUBMASTERVALUE
	case 7:
		int cuelistIndex = readNum(offset);
		int level = readNum(offset);
		result = CuelistSubMasterSetValue(cuelistIndex, level);
		break;

	//CUELISTCOPY
	case 8:
		int cuelistIndex = readNum(offset);
		result = CuelistCopy(cuelistIndex);
		return result;
		break;

	//CUELISTPASTE
	case 9:
		int cuelistIndex = readNum(offset);
		result = CuelistPaste(cuelistIndex);
		return result;
		break;

	//CUELISTSETNAME
	case 10:
		int cuelistIndex = readNum(offset);
		readString(offset);
		string name = sArg;
		result = CuelistSetName(cuelistIndex, name);
		break;

	//CUELISTSTART
	case 11:
		int index = readNum(offset);
		CuelistStart(index);
		result = SUCCESS;
		break;

	//CUELISTPAUSE
	case 12:
		int index = readNum(offset);
		CuelistPause(index);
		result = SUCCESS;
		break;

	//CUELISTSTOP
	case 13:
		int index = readNum(offset);
		CuelistStop(index);
		result = SUCCESS;
		break;

	//CUELISTSTOPALL
	case 14:
		CuelistStopAll();
		result = SUCCESS;
		break;

	//CUELISTSETPROPERTY
	case 15:
		int index = readNum(offset);
		readString(offset);
		string propertyName = sArg;
		int propertyValue = readNum(offset);
		result = CuelistSetProperty(index, propertyName, propertyValue);
		break;

	//CUESETPROPERTY
	case 16:
		int cuelistIndex = readNum(offset);
		int cueIndex = readNum(offset);
		readString(offset);
		string propertyName = sArg;
		int propertyValue = readNum(offset);
		result = CueSetProperty(cuelistIndex, cueIndex, propertyName, propertyValue);
		break;

	//DELETECUE
	case 17:
		int cuelistIndex = readNum(offset);
		int cueIndex = readNum(offset);
		result = CueDelete(cuelistIndex, cueIndex);
		break;

	//GOTOCUE
	case 18:
		int cuelist = readNum(offset);
		int cue = readNum(offset);
		int jump = readNum(offset);
		result = CuelistGotoCue(cuelist, cue, jump);
		break;

	//SETCUENAME
	case 19:
		int cuelistIndex = readNum(offset);
		int cueIndex = readNum(offset);
		readString(offset);
		string name = sArg;
		result = CueSetName(cuelistIndex, cueIndex, name);
		break;

	//RECORDCUE
	case 20:
		int cuelistIndex = readNum(offset);
		readString(offset);
		string name = sArg;
		RecordCue(cuelistIndex, name);
		// Ingnore the failure from RecordCue when stage is empty on record
		result = SUCCESS;
		break;

	//SETLEVEL
	case 21:
		int level = readNum(offset);
		int level24 = to24Bit(level);
		SetPosition(level24);
		proLoadValue(0);
		result = SUCCESS;
		break;

	//SETRGBW
	case 22:
		setRgbw();
		result = SUCCESS;
		break;

	//PROCLEAR
	case 23:
		proClear();
		result = SUCCESS;
		break;

	//GRPUSE
	case 24:
		readString(offset);
		string groupName = sArg;
		int expand = readNum(offset);
		result = grpUse(groupName, expand);
		break;

	//GRPCREATE
	case 25:
		readString(offset);
		string groupName = sArg;
		int selectedOnly = intBool(readNum(offset));
		GrpCreate(groupName, selectedOnly);
		result = SUCCESS;
		break;

	//SETSWITCHSTATE
	case 26:
		readString(offset);
		string switchName = sArg;
		int value = readNum(offset);
		SetSwitchState(switchName, value);
		result = SUCCESS;
		break;

	//VMSETLEVEL
	case 27:
		int index = readNum(offset);
		int level = readNum(offset);
		int fadeTime = readNum(offset);
		VersatileMasterStartAutoFade(index, level, fadeTime);
		result = SUCCESS;
		break;

	//MEDIACONTINUE
	case 28:
		int player = readNum(offset);
		MediaContinue(player);
		break;

	//MEDIAPAUSE
	case 29:
		int player = readNum(offset);
		MediaPause(player);
		break;

	//MEDIAPLAY
	case 30:
		int player = readNum(offset);
		int flags = readNum(offset);
		readString(offset);
		string filepath = sArg;
		MediaPlay(player, flags, filepath);
		break;

	//MEDIASETVOLUME
	case 31:
		int player = readNum(offset);
		int level = readNum(offset);
		MediaSetVolumePercent(player, level);
		break;

	//MEDIASTOP
	case 32:
		int player = readNum(offset);
		MediaStop(player, 0, "");
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

	//CUESETFADETIME
	case 35:
		int cuelistIndex = readNum(offset);
		int cueIndex = readNum(offset);
		int fadeTime = readNum(offset);
		CueSetProperty(cuelistIndex, cueIndex, "InFadeTime", fadeTime);
		break;

	//SETRGB
	case 36:
		setRgb();
		result = SUCCESS;
		break;

	//RESETCUELIST
	case 37:
		int index = readNum(offset);
		CuelistDeleteAllCues(index);
		result = SUCCESS;
		break;

	//PRINTF
	case 38:
		readString(offset);
		string message = sArg;
		printf(message);
		result = SUCCESS;
		break;

	//MEDIAVOLUMEDELTA
	case 39:
		int index = readNum(offset);
		int delta = readNum(offset);
		MediaSetVolumeDeltaPercent(index, delta);
		result = SUCCESS;
		break;

	//MEDIASETGAMMA
	case 40:
		int index = readNum(offset);
		int contrast = readNum(offset);
		int brightness = readNum(offset);
		int gamma = readNum(offset);
		int channel = readNum(offset);
		MediaSetGamma(index, contrast, brightness, gamma, channel);
		result = SUCCESS;
		break;

	//MEDIASKIP
	case 41:
		int index = readNum(offset);
		int delta = readNum(offset);
		MediaSkip(index, delta);
		result = SUCCESS;
		break;

	//GRPDELETE
	case 42:
		readString(offset);
		string groupName = sArg;
		int expand = readNum(offset);
		result = grpDeleteName(groupName);
		break;

	//ADDFIXTURE
	case 43:
		readString(offset);
		string fixtureType = sArg;

		readString(offset);
		string screenName = sArg;

		const screenId = readNum(offset);
		const sectionIndex = reqdNum(offset);
		const universe = readNum(offset);
		const address = readNum(offset);
		AddFixture(fixtureType, screenName, screenId, sectionIndex, universe, address);
		result = SUCCESS;
		break;

	//SET3DPOSITION
	case 44:
		notImplemented(instructionCode);
		break;

	//SETFIXTURESECTION
	case 45:
		notImplemented(instructionCode);
		break;

	//SETPREHEAT
	case 46:
		notImplemented(instructionCode);
		break;

	//FLUSHPATCH
	case 47:
		notImplemented(instructionCode);
		break;

	//PATCHDONE
	case 48:
		notImplemented(instructionCode);
		break;

	//CUELISTSETLEVEL
	case 49:
		int cuelist = readNum(offset);
		int level = readNum(offset);
		CuelistSubMasterSetValue(cuelist, level);
		break;
	//CUELISTSETCURRENT
	case 50:
		int cuelist = readNum(offset);
		CuelistSetCurrent(cuelist);
		break;
		
	//GRPDELETE
	case 51:
		readString(offset);
		string id = sArg;
		printf("HEARTBEAT: %s", id);
		break;
	}
}

function setRgbw()
{
	setRgb();

	int whiteRaw = readNum(offset);
	//printf("white: %d\n", whiteRaw);
	int whiteLevel = to24Bit(whiteRaw);
	SetPosition(whiteLevel);
	proLoadValue(3);
	//printf("setRGBW Complete");
}

function setRgb()
{
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
}

function notImplemented(int instructionCode)
{

	alert("Action not implemented: %s\n", actions[instructionCode]);
}

function to24Bit(int value)
{
	return ((value + 1) * 256) - 1;
}

function createActionTable()
{
	actions[0] = "EOF";
	actions[1] = "PACKETID";
	actions[2] = "CUELISTDELETEALLCUES";
	actions[3] = "CUELISTMUTEXRELEASE";
	actions[4] = "CUELISTSKIPBACKWARD";
	actions[5] = "CUELISTSKIPFORWARD";
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
	actions[35] = "CUESETFADETIME";
	actions[36] = "SETRGB";
	actions[37] = "RESETCUELIST";
	actions[38] = "PRINTF";
	actions[39] = "MEDIAVOLUMEDELTA";
	actions[40] = "MEDIASETGAMMA";
	actions[41] = "MEDIASKIP";
	actions[42] = "GRPDELETE";
	actions[43] = "ADDFIXTURE";
	actions[44] = "SET3DPOSITION";
	actions[45] = "SETFIXTURESECTION";
	actions[46] = "SETPREHEAT";
	actions[47] = "FLUSHPATCH";
	actions[48] = "PATCHDONE";
	actions[49] = "CUELISTSETLEVEL";
	actions[50] = "CUELISTSETCURRENT";
	actions[51] = "HEARTBEAT";
}

RegisterEvent(UdpReceive, OnUdp);
Suspend();