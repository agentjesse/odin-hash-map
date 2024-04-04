/* Next task:
- when you get to the point of storing key value pairs in buckets, keep a set or array with them for methods like has()=boolean

-apply modulo on each iteration of loop in hashing fn to avoid large numbers in javascript. pass in capacity of hashmap instead of leaving null default.

*/

//Imports
//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, tableToConsole as tb } from './logger.js'; //shorthand loggers
import makeLinkedList from './linkedList.js'; //default import example

//string hashing fn
const getHashCode = (key, capacity = null)=> {
  let hashCode = 0;
  //todo: implement modulo using capacity
  for ( let i = 0; i < key.length; i++ ) {
    //31 is odd prime number close to size of alphabet
    hashCode = 31 * hashCode + key.charCodeAt(i);
  }
  return hashCode;
};

//hashmap creation factory fn, yay no overthinking 'this'.
const makeHashMap = ()=> {
  let buckets = new Array(16); //or use Array.from() for mapping fn if needed
  // lg( buckets.length );

  //fn to set key value pair in bucket
  const set = (key, value)=> {
    const storingIndex = getHashCode(key) % 16; //todo: apply modulo during hashing
    buckets[storingIndex] = value;
  };

  return {
    set,
  };
};

//-----------testing
//customer/item key/value pairs for testing:
const namesAndCartItemsArr = [
  ['John Smith', 'Toilet Paper'],
  ['Emily Johnson', 'Bottled Water'],
  ['Michael Williams', 'Rice'],
  ['Emma Jones', 'Chicken Breasts'],
  ['James Brown', 'Cereal'],
  ['Olivia Davis', 'Bananas'],
  ['William Miller', 'Apples'],
  ['Sophia Wilson', 'Milk'],
  ['Alexander Moore', 'Eggs'],
  ['Isabella Taylor', 'Spinach'],
  ['Daniel Anderson', 'Cheese'],
  ['Mia Thomas', 'Bread'],
  ['David Jackson', 'Pasta'],
  ['Ava White', 'Tomatoes'],
  ['Joseph Harris', 'Ground Beef'],
  ['Charlotte Martinez', 'Coffee'],
  ['Matthew Thompson', 'Frozen Pizza'],
  ['Amelia Garcia', 'Paper Towels'],
  ['Samuel Robinson', 'Orange Juice'],
  ['Ella Lee', 'Salmon']
];
lg( `'John Smith' hash: ${  getHashCode( namesAndCartItemsArr[0][0] )}` ); //hash fn test from string key
// lg( getHashCode( 'JohnSmith' ) ); //hash fn test: no space
// lg( getHashCode( 'SmithJohn' ) ); //hash fn test: permutation
const namesAndCartItemsMap = makeHashMap();
namesAndCartItemsMap.set( namesAndCartItemsArr[0][0], namesAndCartItemsArr[0][1] );
lg( namesAndCartItemsMap );
