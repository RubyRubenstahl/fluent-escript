const createScript = require('./index');



const script = createScript('testScript')
    .cuelistStop(5)
    .cuelistPlay(3)
    .grpUse('Test')
    .cueRecord(5, "Test");


console.log(script);

