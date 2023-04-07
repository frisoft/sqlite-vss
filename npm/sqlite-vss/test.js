import test from "node:test";
import * as assert from "node:assert";

import { getVectorLoadablePath, getVssLoadablePath } from "./src/index.js";
import { basename, extname, isAbsolute } from "node:path";

import Database from "better-sqlite3";
import sqlite3 from "sqlite3";

test("loadable paths", (t) => {
  const vectorLoadablePath = getVectorLoadablePath();
  assert.strictEqual(isAbsolute(vectorLoadablePath), true);
  assert.strictEqual(
    basename(vectorLoadablePath, extname(vectorLoadablePath)),
    "vector0"
  );

  const vssLoadablePath = getVssLoadablePath();
  assert.strictEqual(isAbsolute(vssLoadablePath), true);
  assert.strictEqual(
    basename(vssLoadablePath, extname(vssLoadablePath)),
    "vss0"
  );
});

test("better-sqlite3", (t) => {
  const db = new Database(":memory:");
  db.loadExtension(getVectorLoadablePath());
  db.loadExtension(getVssLoadablePath());
  const version = db.prepare("select vss_version()").pluck().get();
  assert.strictEqual(version[0], "v");
});

test("sqlite3", async (t) => {
  const db = new sqlite3.Database(":memory:");
  db.loadExtension(getVectorLoadablePath());
  db.loadExtension(getVssLoadablePath());
  let version = await new Promise((resolve, reject) => {
    db.get("select vss_version()", (err, row) => {
      if (err) return reject(err);
      resolve(row["vss_version()"]);
    });
  });
  assert.strictEqual(version[0], "v");
});
