const items = new Map()

exports.write = function (id, item) {
    items.set(id, item)
}

exports.read = function (id) {
    return items.get(id)
}

exports.count = function () {
    return items.size
}