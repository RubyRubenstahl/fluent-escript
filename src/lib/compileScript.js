const {SmartBuffer }= require('smart-buffer');
const get = require('lodash.get');


const compileTokenizeInstruction = (buffer,tokenizedInstruction)=>{

};


function compileScript(script={}){
  const buffer = new SmartBuffer();
  const actions = get(script, 'actions', []);

  const tokenizedInstructions = actions
      .map(instructionSet => instructionSet.tokenized)
      .map(tokenizedInstruction => tokenizedInstruction.map(token=> {
        const type = typeof token;
        switch (type) {
          case 'string':
            buffer.writeStringNT(token);
            break;
          case 'number':
            buffer.writeInt16LE(Math.floor(token));
            break;
          case 'boolean':
            buffer.writeInt16LE(token === true ? 1 : 0);
            break;
        }
      }));


  const compiled = buffer.toBuffer();
  return compiled;

}

module.exports = compileScript;