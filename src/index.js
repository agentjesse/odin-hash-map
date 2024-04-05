/* Next task:
- when you get to the point of storing key-value pairs in buckets, keep a set or array with them for methods like has()=boolean

-linked lists are too large, need to implement array growth via 0.75 load factor and bucket fullness.

*/

//Imports
//For Node.js, when importing local modules, include the file extension in the import statement.
import { logToConsole as lg, tableToConsole as tb } from './logger.js'; //shorthand loggers
import makeLinkedList from './linkedList.js'; //default import example

//string hashing fn returns hashcode which is also bucket address. Passing in bucket
//capacity here to use the modulo operator in each loop; this keeps the numbers small
//for JS accuracy and also prevents them ever being more than capacity.
const getHashCode = (key, capacity)=> {
  let hashCode = 0;
  for ( let i = 0; i < key.length; i++ ) {
    //31 is odd prime number related to alphabet size
    hashCode = (31 * hashCode + key.charCodeAt(i)) % capacity;
  }
  lg( `hashCode: ${ hashCode }` );
  return hashCode;
};

//hashmap creation factory fn, yay no overthinking 'this'.
const makeHashMap = ()=> {
  //start with default size of 16 buckets. todo: implement array growth
  let buckets = new Array(16); //or use Array.from() for mapping fn if needed
  const loadFactor = 0.75;

  //fn to set key-value pair in bucket
  const set = (key, value)=> {
    const bucketIndex = getHashCode(key, buckets.length);
    // lg( `bucketIndex: ${ bucketIndex }` );

    //create or append linked list
    if ( buckets[bucketIndex] === undefined ) { //when bucket empty
      const newLinkedList = makeLinkedList(); //make linked list
      newLinkedList.append( [key, value] ); //add key-value pair value node
      buckets[bucketIndex] = newLinkedList;
      // lg( `stored key-value pair in bucket: ${ bucketIndex }` );
    }

  };

  return {
    set,
  };
};

//-----------testing
//customer-item key-value pairs for testing:
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
  ['Ella Lee', 'Salmon'],
  ['Benjamin Clark', 'Yogurt'],
  ['Lily Rodriguez', 'Avocado'],
  ['Christopher Lewis', 'Potatoes'],
  ['Grace Walker', 'Cucumber'],
  ['Andrew Hall', 'Onions'],
  ['Madison Allen', 'Lettuce'],
  ['Lucas Young', 'Peanut Butter'],
  ['Avery Wright', 'Ice Cream'],
  ['Evelyn King', 'Broccoli'],
  ['Jackson Scott', 'Ground Turkey']
];
// lg( `'John Smith' hash: ${  getHashCode( namesAndCartItemsArr[0][0] )}` ); //hash fn test from string key
// lg( getHashCode( 'JohnSmith' ) ); //hash fn test: no space
// lg( getHashCode( 'SmithJohn' ) ); //hash fn test: permutation
const namesAndCartItemsMap = makeHashMap();
//set single entry in HashMap
// namesAndCartItemsMap.set( namesAndCartItemsArr[0][0], namesAndCartItemsArr[0][1] );
//set full data in Hash Map
namesAndCartItemsArr.forEach( ([key, value])=> {
  namesAndCartItemsMap.set( key, value );
} );
lg( namesAndCartItemsMap );
