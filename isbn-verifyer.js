/*
    ============================================
     ISBN verifyer
     Based on: http://www.hahnlibrary.net/libraries/isbncalc.html
     Can validate a list (array) of many isbns in one loop.
    ============================================
*/
function validateISBN(isbn_string) {
var numeric_only_isbn_string = isbn_string.toString().replace(/[^0-9]/g,'');
var len = numeric_only_isbn_string.length;

if(len <= 10) {
  if(!isValidISBN13(numeric_only_isbn_string)) {
      console.log(">> ISBN10 control digit FAIL: " + isbn_string);
      if(len < 10) {
        console.log("only " + len + " digits!");
      }
    } else {
      console.log("ISBN10 control digit OK: " + isbn_string);
    }
} else if(len <= 13) {
    if(!isValidISBN13(numeric_only_isbn_string)) {
      console.log(">> ISBN 13 control digit FAIL: " + isbn_string);
      if(len < 13) {
        console.log("only " + len + " digits!");
      }
    } else {
      console.log("ISBN13 control digit OK: " + isbn_string);
    }
} else 
  console.log("FAIL: too many digits in isbn");
}

function isValidISBN13(isbn_string)
{
var isbn_num_only = isbn_string.toString().replace(/[^0-9]/g,'');
 var calculated_checksum_digit;
 var isbn_base = isbn_num_only.substring(0,12);
 var supplied_checksum_digit = isbn_num_only.substring(12,13);
 
 var isbn_working_string = isbn_base;

  // if source is less than 12 chars, we make it 12 chars
  if(isbn_base.length < 12) {
    var holdString = '000000000000' + isbn_base;
    isbn_base = holdString.substring(holdString.length - 12, holdString.length);
  }
 var csumTotal = 0; // The checksum working variable starts at zero

 // If the source message string is less than 12 characters long, we make it 12 characters

  // Calculate the checksum value for the message

 for( charPos = isbn_working_string.length - 1; charPos >= 0; charPos--) 
  {
  if( charPos / 2 == parseInt(charPos/2) )
   csumTotal = csumTotal + (parseInt(isbn_working_string.substring(charPos,charPos+1)));
  else
   csumTotal = csumTotal + (3 * parseInt(isbn_working_string.substring(charPos,charPos+1)));
  }

 // Calculate the checksum digit

 var remainder = csumTotal - parseInt(csumTotal/10) * 10;
 if( remainder == 0 )
  calculated_checksum_digit = 0;
 else
  calculated_checksum_digit = 10 - remainder;

  return calculated_checksum_digit == supplied_checksum_digit;
}


function isValidISBN10(isbn_string)
{
var isbn_num_only = isbn_string.toString().replace(/[^0-9]/g,'');
 var calculated_checksum_digit;
 var isbn_base = isbn_num_only.substring(0,9);
 var supplied_checksum_digit = isbn_num_only.substring(9,10);
 var isbn_working_string = isbn_base;
 var csumTotal = 0; // The checksum working variable starts at zero

  // if source is less than 9 chars, we make it 9 chars
  if(isbn_base.length < 9) {
    var holdString = '000000000' + isbn_base;
    isbn_base = holdString.substring(holdString.length - 9, holdString.length);
  }



 // Calculate the checksum value for the message

 for( var charPos = 0; charPos <= 8; charPos++) 
  {
  csumTotal = csumTotal + ((charPos+1) * parseInt(isbn_base.substring(charPos,charPos+1)));

  }

 // Calculate the checksum digit

 var remainder = csumTotal - parseInt(csumTotal/11) * 11;
 if( remainder == 0 )
  calculated_checksum_digit = '0';
 if ( remainder == 10 )
  calculated_checksum_digit = 'X';
 else
  calculated_checksum_digit = remainder;

  return calculated_checksum_digit == supplied_checksum_digit;
}

function validateISBNs(isbn_array) {
  for (var k = 0; k < isbn_array.length; k++) {
    validateISBN(isbn_array[k]);
  }
}


var isbns_to_check = ["978-82-78-94309-0",
"987-82-78-94310-6",
"978-82-78-94311-3",
"978-82-7894-312-0",
"978-82-78-94313-7",
"978-82-78-94314-4",
"2147483647",
"978-82-7894-317-5",
"978-82-7894-318-2",
"978-82-7894-319-9",
"978-82-7894-320-5",
"978-82-7894-322.8",
"978-82-7894-323-6",
"978-82-78-324-3",
"978-82-78-325-0",
"978-82-7894-321-2",
"978-82-78-94327-4",
"978-82-7894-369-4",
"978-82-7894-361-8",
"987-82-7894-326-7",
"978-82-7894-362-5",
"978-82-7894-364-9",
"978-82-7894-365-6",
"978-82-7894-366-3",
"978-82-7894-367-0",
"978-82-7894-368-7",
"978-82-7894-392-2",
"978-82-7894-393-9",
"978-82-7894-395-3",
"978-82-7894-396-0",
"978-82-7894-399-7",
"978-82-7894-393-4",
"978-82-7894-399-1",
"978-82-7894-407-3",
"978-82-7894-416-5",
"978-82-7894-448-6",
"978-82-7894-420-2",
"978-82-7894-428-8",
"978-82-7894-430-1",
"978-82-7894-436-3",
"978-82-7894-438-7",
"978-82-7894-440-0",
"978-82-7894-444-8",
"978-82-7894-446-2",
"978-82-7894-450-9",
"978-82-7894-458-5",
"978-82-7894-459-2",
"978-82-7894-470-7",
"978-82-7894-471-4",
"978-82-7894-480-6",
"978-82-7894-500-1",
"978-82-7894-502-5",
"978-82-7894-526-1",
"978-82-7894-530-8",
"978-82-7894-544-5",
"978-82-7894-548-3",
"978-82-7894-552-0",
"978-82-7894-576",
"978-82-7894-584-1",
"978-82-7894-586-5",
"978-82-7894-594-0"];

validateISBNs(isbns_to_check);
