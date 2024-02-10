import { NextRequest, NextResponse } from "next/server";
import { readdirSync, createReadStream } from 'fs';
import { join } from 'path';
// import archiver from 'archiver';
// const archiver = require('archiver');
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const zip = new JSZip();

    // set content type to zip
    // const response = NextResponse.next();
    // response.headers.set('Content-Type', 'application/zip');

    // Get the list of files in the /exports folder
    const files = readdirSync(join(__dirname, '..', '..', '..','..', '..', 'exports'));
    console.log("FROM download route:", files);
    /* files looks like this
      ['10½ Lessons from Experience (highlights).md',
      'Starting Point: 1979-1996 (highlights).md',
      'The Notes (highlights).md']
    */
    // Add each file to the archive
    files.forEach((file) => {
      const filePath = join(__dirname, '..', '..', '..','..', '..', 'exports', file);
      // console.log("filePath baby", filePath);
      zip.file(file, createReadStream(filePath));
    });

    const archive = await zip.generateAsync({type:"blob"})

    return new Response(archive, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="bookHighlights.zip"'
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "zip file could not be generated."
    });
  }
}