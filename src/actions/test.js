const Programmer = require('./index');

const programmer = new Programmer({transport: msg => console.log(msg)})

programmer
    .cuelistStop(5)
    .cuelistPlay(3)
    .grpUse('Test')
    .cueRecord(5, "Test")
    .run();