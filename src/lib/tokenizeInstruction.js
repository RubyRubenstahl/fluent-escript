const instructionCodes = require('../instructionCodes');

function tokenizeInstruction({command, params=[]}){
  const instructionCode = instructionCodes[command];
  if(instructionCode===undefined){
    throw new Error(`Invalid Instruction Name: ${command}`);
  }
  return [instructionCode, ...params];
}

module.exports = tokenizeInstruction;




