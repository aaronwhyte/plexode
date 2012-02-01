function LogicLink(outputSpriteId, outputId, inputSpriteId, inputId) {
  this.id = LogicLink.nextId++;
  this.outputSpriteId = outputSpriteId;
  this.outputId = outputId;
  this.inputSpriteId = inputSpriteId;
  this.inputId = inputId;
}

LogicLink.nextId = 1;
