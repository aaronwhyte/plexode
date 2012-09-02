/**
 * Address of a particular jack in a Vorp instance.
 * @param sprite
 * @param type
 * @param index
 * @constructor
 */
function JackAddress(sprite, type, index) {
  this.sprite = sprite;
  this.type = type;
  this.index = index;
}

JackAddress.Type = {
  INPUT: 'input',
  OUTPUT: 'output'
};

