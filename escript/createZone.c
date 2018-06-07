// createCuelists script comment
int baseCuelist = CuelistGetCurrent()+1;
string name;
int roomId;
int zoneId;

int dlg = PropDlgInit("Create Zone");
	PropDlgAddInt("Cuelist", "", baseCuelist, 0, 50000);
	PropDlgAddString("Room/Area Name", name, 255);
	PropDlgAddInt("Room/Area Id", "", roomId, 0, 50000);
	PropDlgAddInt("Zone Id (0=master)", "", zoneId, 0, 50000);

int canceled = !PropDlgDoModal();

if(canceled){
	printf("Canceled. Zone not created");
	return;
}

// Create names for cuelist indicies
int cuelistIndex = QL(baseCuelist);
int presetQl = cuelistIndex + 0;
int redQl = cuelistIndex + 1;
int greenQl = cuelistIndex + 2;
int blueQl = cuelistIndex + 3;


// Clear the cuelists
CuelistDeleteAllCues(cuelistIndex);
CuelistDeleteAllCues(redQl);
CuelistDeleteAllCues(greenQl);
CuelistDeleteAllCues(blueQl);

// Create the name string for the zone's main cuelist
string presetQlName = format("Presets - R[%d] Z[%d]", roomId, zoneId);
if(zoneId == 0) {
	presetQlName = format("Presets - R[%d] Master", roomId);
}
printf(presetQlName);

// Apply names to the cuelists
CuelistSetName(presetQl, presetQlName);
CuelistSetName(redQl, "red");
CuelistSetName(greenQl, "green");
CuelistSetName(blueQl, "blue");


// Create names for VM indicies
int presetVm = presetQl + 1;
int redVm = redQl + 1;
int greenVm = greenQl + 1;
int blueVm = blueQl + 1;

// Assign VMs
CuelistSetProperty(presetQl,"ExtraSubMaster", presetVm);
CuelistSetProperty(redQl,"ExtraSubMaster", redVm);
CuelistSetProperty(greenQl,"ExtraSubMaster", greenVm);
CuelistSetProperty(blueQl,"ExtraSubMaster", blueVm);



