const levels = {
  info: "\x1b[36mINFO\x1b[0m",
  warn: "\x1b[33mWARN\x1b[0m",
  error: "\x1b[31mERROR\x1b[0m",
  ok: "\x1b[32mOK\x1b[0m",
};

function ts() {
  return new Date().toISOString();
}

function log(level, ...args) {
  const tag = levels[level] || level;
  console.log(`[${ts()}] [${tag}]`, ...args);
}

module.exports = {
  info: (...a) => log("info", ...a),
  warn: (...a) => log("warn", ...a),
  error: (...a) => log("error", ...a),
  ok: (...a) => log("ok", ...a),
};
