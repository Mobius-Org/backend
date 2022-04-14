exports.getOne = (Model, param) => {
    return Model.findOne({ param });
}