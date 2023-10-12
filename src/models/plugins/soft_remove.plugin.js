module.exports = function (schema) {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
  });
  const findEventList = ['find', 'findOne', 'findById'];

  schema.pre(findEventList, function () {
    this.where('deletedAt', null);
  });

  // eslint-disable-next-line no-param-reassign
  schema.methods.removeSoft = async function (callback) {
    this.deletedAt = Date.now();
    this.save(callback);
  };

  return schema;
};
