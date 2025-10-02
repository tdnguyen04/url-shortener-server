const CustomError = require("../errors/CustomError")

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      status: err.statusCode,
      msg: err.message
    })
  }
  return res.status(500).send({
    msg: `Internal error. Please try again`
  })
}

module.exports = errorHandler