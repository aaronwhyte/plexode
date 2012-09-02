/**
 * @param outputSpriteId
 * @param outputIndex
 * @param inputSpriteId
 * @param inputIndex
 * @constructor
 */
function LogicLink(outputSpriteId, outputIndex, inputSpriteId, inputIndex) {
  this.id = LogicLink.nextId++;
  this.outputSpriteId = outputSpriteId;
  this.outputIndex = outputIndex;
  this.inputSpriteId = inputSpriteId;
  this.inputIndex = inputIndex;
}

LogicLink.nextId = 1;
