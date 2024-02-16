const jwt = require("jsonwebtoken");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = (request, response, next) => {
  const { token } = request;
  if (!token) {
    request.user = null;
  } else {
    request.user = jwt.verify(token, process.env.SECRET);
  }
  next();
};

const errorHandler = (e, req, res, next) => {
  logger.error(e.message);
  if (e.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } if (e.name === "ValidationError") {
    return res.status(400).send({ error: e.message });
  } if (e.name === "JsonWebTokenError") {
    return res.status(401).send({ error: e.message });
  }
  next(e);
};

module.exports = {
  unknownEndpoint, errorHandler, requestLogger, tokenExtractor, userExtractor,
};
