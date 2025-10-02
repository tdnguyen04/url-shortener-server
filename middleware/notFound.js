const CustomError = require("../errors/CustomError")

const notfound = (req, res) => {
  throw new CustomError(`Resource not found`, 404)
}

module.exports = notfound