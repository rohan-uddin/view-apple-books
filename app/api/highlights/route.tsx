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
    console.log("FROM THE SERVER: ", body)
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
