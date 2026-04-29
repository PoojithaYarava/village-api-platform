const assert = require("node:assert/strict");
const test = require("node:test");

process.env.USE_PROCESSED_CSV = "false";

const { app } = require("./app");

function listen() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

test("health endpoint responds", async () => {
  const server = await listen();

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.status, "healthy");
  } finally {
    await close(server);
  }
});

test("states endpoint returns wrapped geography data", async () => {
  const server = await listen();

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/states`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.ok(Array.isArray(payload.data));
    assert.ok(payload.data.length > 0);
    assert.ok(payload.meta.requestId.startsWith("req_"));
  } finally {
    await close(server);
  }
});
