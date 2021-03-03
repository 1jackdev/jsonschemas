process.env.NODE_ENV = "test";
const db = require("../db");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const updateBookSchema = require("../schemas/updateBookSchema.json");

describe("Test Book class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM books");
    let b = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Broderick",
      language: "spanish",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
    let b2 = await Book.create({
      isbn: "0691161420",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Grace",
      language: "German",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });

  test("can get", async function () {
    let b = await Book.findOne("0691161518");
    expect(b).toEqual({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Broderick",
      language: "spanish",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });

  test("can get all", async function () {
    let b = await Book.findAll();
    expect(b).toEqual([
      {
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Broderick",
        language: "spanish",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017,
      },
      {
        isbn: "0691161420",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Grace",
        language: "German",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking Hidden Math in Video Games",
        year: 2017,
      },
    ]);
  });

  test("can post", async function () {
    let data = {
      isbn: "1010101010",
      amazon_url: "http://a.co/eobPtX2",
      author: "Will Grace",
      language: "Spanish",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    };
    let b = await Book.create(data);
    expect(b).toEqual(data);
  });

  test("can put", async function () {
    let data = {
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Grace",
      language: "Icelandic",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    };
    let b = await Book.update("0691161518", data);
    expect(b).toEqual({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Grace",
      language: "Icelandic",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });
});

test("can delete", async function () {
  await Book.remove("0691161420");
  let b = await Book.findAll();
  expect(b).toEqual([
    {
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Grace",
      language: "Icelandic",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    },
  ]);
});

test("does create schema work", async function () {
  let data = {
    book: {
      isbn: "1010101010",
      amazon_url: "http://a.co/eobPtX2",
      author: "Will Grace",
      language: 14,
      pages: "apples",
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    },
  };
  let validityCheck = jsonschema.validate(data, bookSchema);
  let listOfErrors = validityCheck.errors.map((e) => e.stack);
  expect(validityCheck.valid).toBe(false);
  expect(listOfErrors).toContain(
    "instance.book.pages is not of a type(s) integer"
  );
});

test("does update schema work", async function () {
  let data = {
    book: {
      amazon_url: "amaoznasdeobPtX2",
      author: "Will Grace",
      language: 14,
      pages: "apples",
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    },
  };
  let validityCheck = jsonschema.validate(data, updateBookSchema);
  let listOfErrors = validityCheck.errors.map((e) => e.stack);
  expect(listOfErrors).toContain(
    "instance.book.pages is not of a type(s) integer"
  );
  expect(listOfErrors).toContain(
    'instance.book.amazon_url does not conform to the "uri" format'
  );
});

afterAll(async function () {
  await db.end();
});
