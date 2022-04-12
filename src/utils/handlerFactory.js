exports.getOne = (Model, _id) => {
    return Model.findOne({ _id });
}