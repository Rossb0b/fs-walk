import test from "tape";

// Require Node.js Dependencies
import path from "path";
import { fileURLToPath } from "url";

// Require Internal Dependencies
import { walk, walkSync } from "../index.js";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const kRootLocation = path.join(__dirname, "..");
const kFixturesDir = path.join(__dirname, "fixtures");
const kExpectedJSFiles = [
  "index.js",
  "test/walk.js"
].map((fileLocation) => path.normalize(fileLocation));

test("should return all JavaScript files of the project (Asynchronously)", async(tape) => {
  const files = [];
  const options = { extensions: new Set([".js"]) };

  for await (const [dirent, absoluteFileLocation] of walk(kRootLocation, options)) {
    if (dirent.isFile()) {
      files.push(path.relative(kRootLocation, absoluteFileLocation));
    }
  }

  tape.deepEqual(files, kExpectedJSFiles);
  tape.end();
});

test("should return all JavaScript files of the project (Synchronously)", async(tape) => {
  const options = { extensions: new Set([".js"]) };

  const files = [...walkSync(kRootLocation, options)]
    .filter(([dirent]) => dirent.isFile())
    .map(([, absoluteFileLocation]) => path.relative(kRootLocation, absoluteFileLocation));

  tape.deepEqual(files, kExpectedJSFiles);
  tape.end();
});

test("should return all files in the fixtures directory", async(tape) => {
  const files = [...walkSync(kFixturesDir)]
    .filter(([dirent]) => dirent.isFile())
    .map(([, absoluteFileLocation]) => path.relative(kRootLocation, absoluteFileLocation));

  const expectedFiles = [
    "test/fixtures/foobar.txt",
    "test/fixtures/test.md"
  ].map((fileLocation) => path.normalize(fileLocation));
  tape.deepEqual(files, expectedFiles);
  tape.end();
});

