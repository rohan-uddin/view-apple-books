import { NextRequest, NextResponse } from "next/server";
// import * as server from "@/components/providers/server";
// import * as ibooks from "@/components/providers/ibooks";
import ibooks from "@/components/providers/ibooks";
const fs = require('fs');
// const bodyParser = require('body-parser');
const currentDate = new Date();

interface HighlightData {
  selectedText: string;
  note: string;
}

/**
 * FORMATTING FUNCTIONS ***********
 * This is what ibooks looks like:
 *
 * ibooks {
 *   getBooks: [AsyncFunction: getBooks],
 *   getAnnotations: [AsyncFunction: getAnnotations]
 * }
 */
async function getBookTitles() {
  try {
    const bookData: any[] = [];
    // console.log("ibooks - getBOOKS", ibooks.getBooks()); // {this works now!}
    // const value = await ibooks.getBooks().then((books) => console.log(books)); // THIS IS WORKING CODE
    const value = await ibooks.getBooks().then((books) => {
      // console.log(books);
      for (const row in books) {
        // console.log("PUSHING BOOKS BITCH");
        bookData.push(formatBookJSON(books[row]));
      }
      // return books;
    }) // THIS IS WORKING CODE

    // console.log(bookData.slice(10,20)) // THIS WORKS
    const filteredBookTitles = bookData!.filter((book) => book.bookID.length === 32);
    // console.log(filteredBookTitles.slice(10,20))
    return filteredBookTitles;

  } catch (error) {
    console.error(error);
  }
}

function sendAnnotations(bookID: string, bookTitle: string, bookAuthor: string) {
  ibooks.getAnnotations().then((value) => {
    // console.log(value[0]);
    // result gives you a filtered object with annotations specific to the book!
    const result = value.filter((annot: { bookId: string }) => annot.bookId === bookID);

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


    result.forEach((element:HighlightData) => {
        markdownOut += `\t- ${element.selectedText}\n`
        if (element.note) {markdownOut += `\t\t- ${element.note}\n`}
    });

    const path = 'exports'
    if (fs.existsSync(path)) {
      console.log('Folder exists!');
      fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, (err: any) => {
        if (err) throw err;
        console.log("Data written to file");
      });
    } else {
      console.log('Folder does not exist, making now...');
      fs.mkdir('exports', (err: any) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(`exports/${bookTitle} (highlights).md`, markdownOut, (err: any) => {
            if (err) throw err;
            console.log("Data written to file");
          });
        }
      });
    }
  });
  return true
}

/**
 * GET REQUEST
 */
export async function GET(request: NextRequest) {
  try {
    const bookData = await getBookTitles();
    return NextResponse.json({
      book_titles: bookData
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "bookData failed to load."
    });
  }
}

/**
 * POST REQUEST
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // console.log("FROM THE SERVER: ", body)

    for (const book of body) {
      sendAnnotations(book.bookID, book.title, book.author);
      console.log("FROM THE SERVER: just exported", book.title)
    }

    return NextResponse.json({
      selected_books: body
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "bookData failed to load."
    });
  }
}



/**
 * HELPER FUNCTIONS
 */
function formatBookJSON(rawTableData: { bookID: any; title: any; author: any; }) {
  return {
    bookID: rawTableData.bookID,
    title: rawTableData.title,
    author: rawTableData.author,
    checked: false,
  };
}

function formatDate(dateObj: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(dateObj).replace(/\b\d{1,2}\b/, match => match + getDaySuffix(Number(match)));

  // console.log(formattedDate); // Output: June 22nd, 2022
  return formattedDate;

  function getDaySuffix(day: number): string {
    const suffixes: string[] = ["th", "st", "nd", "rd"];
    const relevantDigits = (day < 30) ? day % 20 : day % 30;
    const suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
    return suffix;
  }
}
