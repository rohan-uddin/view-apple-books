"use client";
// THIS FILE is a replacement for the old index.js file in the old repo
// old imports
const fs = require('fs');
const bodyParser = require('body-parser');
const currentDate = new Date();
const ibooks = require('./ibooks');

// Functions added from index.js file in the old repo:
function formatBookJSON(rawTableData) {
  return {
    bookID: rawTableData.bookID,
    title: rawTableData.title,
    author: rawTableData.author,
    checked: false,
  };
}


async function getBookTitles() {
  try {
    const value = await ibooks.getBooks();
    const bookData = [];

    for (const row in value) {
      bookData.push(formatBookJSON(value[row]));
    }
    // console.log(bookData[90])
    return bookData;

  } catch (error) {
    console.error(error);
  }
}


getBookTitles().then((bookTitles) => {
  // console.log("Book Titles:", bookTitles);
  // console.log("");
  // filter those names that have a bookID of length 32
  const filteredBookTitles = bookTitles.filter((book) => book.bookID.length === 32);
  // console.log(filteredBookTitles);
  
  // this requires setting up an API:
  // app.get("/api/titles", (req, res) => {
  //   res.json({ book_titles: filteredBookTitles});
  // });

  return filteredBookTitles;

});

function sendAnnotations(bookID, bookTitle, bookAuthor) {
  ibooks.getAnnotations().then((value) => {
    // console.log(value[0]);
    // result gives you a filtered object with annotations specific to the book!
    const result = value.filter(annot => annot.bookId == bookID)
    // console.log(result)

    // Writing to a markdown file
    let markdownOut = ""
    markdownOut += `title::  ${bookTitle} (highlights)\n`
    markdownOut += `author:: [[${bookAuthor}]]\n`
    markdownOut += `full-title:: ${bookTitle}\n`
    markdownOut += `category:: #books #Inbox \n`
    markdownOut += `url:: \n`
    markdownOut += `tags:: \n\n`
    markdownOut += `- Highlights synced manually [[${formatDate(currentDate)}]]\n`
    

    result.forEach(element => {
        markdownOut += `\t- ${element.selectedText}\n`
        if (element.note) {markdownOut += `\t\t- ${element.note}\n`}
    });

    path = 'exports'
    if (fs.existsSync(path)) {
      console.log('Folder exists!');
      fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
        if (err) throw err;
        console.log("Data written to file");
      });
    } else {
      console.log('Folder does not exist, making now...');
      fs.mkdir('exports', (err) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
            if (err) throw err;
            console.log("Data written to file");
          });
        }
      });
    }

    // fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, err => {
    //     if (err) throw err;
    //     console.log("Data written to file");
    // });

    // fs.close();
  });
  return true
}

function formatDate(dateObj) {
  const options = { year: "numeric", month: "long", day: "numeric" };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(dateObj).replace(/\b\d{1,2}\b/, match => match + getDaySuffix(match));

  // console.log(formattedDate); // Output: June 22nd, 2022
  return formattedDate

  function getDaySuffix(day) {
      const suffixes = ["th", "st", "nd", "rd"];
      const relevantDigits = (day < 30) ? day % 20 : day % 30;
      const suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
      return suffix;
  }
}