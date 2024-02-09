import { NextRequest, NextResponse } from "next/server";
// import * as server from "@/components/providers/server";
// import * as ibooks from "@/components/providers/ibooks";
import ibooks from "@/components/providers/ibooks";

/**
 * This is what ibooks looks like:
 *
 * ibooks {
 *   getBooks: [AsyncFunction: getBooks],
 *   getAnnotations: [AsyncFunction: getAnnotations]
 * }
 */
console.log("ibooks", ibooks); 
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

// OLD VERSION
// const finalTITLES = getBookTitles().then((bookTitles) => {
//   // filter those names that have a bookID of length 32
//   console.log("I AM INSIDE finalTITLES")
//   const filteredBookTitles = bookTitles!.filter((book) => book.bookID.length === 32);
//   return filteredBookTitles;
// });


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

function formatBookJSON(rawTableData: { bookID: any; title: any; author: any; }) {
  return {
    bookID: rawTableData.bookID,
    title: rawTableData.title,
    author: rawTableData.author,
    checked: false,
  };
}

// BACKUP:
// export function GET(request: NextRequest) {

//   const finalTITLES = getBookTitles().then((bookTitles) => {
//     console.log("I AM INSIDE finalTITLES")
//     console.log(bookTitles!.slice(22,27))
//     return bookTitles;
//   }); 

//   console.log("finalTITLES - outside", finalTITLES); // this is a pending promise

//   return NextResponse.json({
//     title: "Welcome to your new Next.js app!",
//     description: "Get started by editing app/page.tsx",
//     book_titles: finalTITLES
//   });
// }