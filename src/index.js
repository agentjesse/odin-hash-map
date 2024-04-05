/* Next task:
-linked lists are too large, need to implement array growth via 0.75 load factor and bucket fullness.

*/

//Imports
//For Node.js, when importing local modules, include the file extension in the import statement
import { logToConsole as lg } from './logger.js'; //shorthand loggers
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
  // lg( `hashCode: ${ hashCode }` );
  return hashCode;
};

//hashmap creation factory fn, yay no overthinking 'this'.
const makeHashMap = ()=> {
  //start with default size of 16 buckets. todo: implement array growth
  let buckets = new Array(16); //or use Array.from() for mapping fn if needed
  const keySet = new Set();
  const loadFactor = 0.75; //for todo above

  //fn to set key-value pair in bucket
  const set = (key, value)=> {
    const bucketIndex = getHashCode(key, buckets.length);
    // lg( `bucketIndex: ${ bucketIndex }` );

    //Check if key already entered in hash map
    if ( keySet.has(key)) { //if key exists, traverse to its node and update its value
      let currentNode = buckets[bucketIndex].getHead();
      while ( currentNode ) { //simple linked list node traversal loop
        if ( currentNode.value[0] === key ) {
          currentNode.value[1] = value;
          return;
        }
        currentNode = currentNode.next;
      }
    } else { //new keys: create new entry and key in keySet
      keySet.add(key); //add key to set
      //create or append linked list
      if ( buckets[bucketIndex] === undefined ) { //when bucket empty
        const newLinkedList = makeLinkedList(); //make linked list
        newLinkedList.append( [key, value] ); //add node. value = key-value pair array
        buckets[bucketIndex] = newLinkedList;
      } else { //handle collisions by appending
        buckets[bucketIndex].append( [key, value] );
      }
    }

  };

  // fn to get value from key
  const get = (key)=> {
    if ( !keySet.has(key) ) return null; //return early if key not in keySet
    //if key exists, traverse to its node and return its value
    const bucketIndex = getHashCode(key, buckets.length);
    let currentNode = buckets[bucketIndex].getHead();
    while ( currentNode ) { //linked list node traversal loop
      if ( currentNode.value[0] === key ) {
        return currentNode.value[1];
      }
      currentNode = currentNode.next;
    }
  };

  //fn to remove entry from hash map using key and return true. return false for missing key
  const remove = (key)=> {
    if ( !keySet.has(key) ) return false; //return false if key not in keySet
    //if key exists: remove its node from its linked list, and key from keySet
    const bucketIndex = getHashCode(key, buckets.length);
    let currentNode = buckets[bucketIndex].getHead();
    let currentIndex = 0;
    while ( currentNode ) { //linked list node traversal loop
      if ( currentNode.value[0] === key ) {
        //use linked list node removal method
        buckets[bucketIndex].removeAt(currentIndex);
        keySet.delete(key);
        return true;
      }
      currentIndex++;
      currentNode = currentNode.next;
    }
  };

  //fn to take key and return boolean based on key's existence in the hash map.
  //Checking the JS Set object instead of doing expensive linked list traversals
  const has = (key)=> keySet.has(key);

  //fn to return total keys in hash map
  const length = ()=> keySet.size;

  //fn to remove all entries from the hash map ...and reset to 16 slot array
  const clear = ()=> {
    buckets = new Array(16);
    keySet.clear();
    lg( '* hash map cleared *' );
  };

  //fn to get array of all keys in hash map
  const keys = ()=> Array.from( keySet.values() );

  //fn to get array of all values in hash map
  const values = ()=> {
    const valuesArr = [];
    let currentNode;
    //iterate over all buckets to get values of linked list nodes
    buckets.forEach( (linkedList)=> { //cb is not invoked for empty slots in array
      currentNode = linkedList.getHead();
      while ( currentNode ) { // linked list node traversal loop
        valuesArr.push( currentNode.value[1] );
        currentNode = currentNode.next;
      }
    } );
    return valuesArr;
  };

  //fn to get array of all key-value pair entries in hash map
  const entries = ()=> {
    const entriesArr = [];
    let currentNode;
    //iterate over all buckets to get values of linked list nodes
    buckets.forEach( (linkedList)=> { //cb is not invoked for empty slots in array
      currentNode = linkedList.getHead();
      while ( currentNode ) { // linked list node traversal loop
        entriesArr.push( currentNode.value );
        currentNode = currentNode.next;
      }
    } );
    return entriesArr;
  };

  //basic visualization fn
  const visualizeHashMap = ()=> {
    lg('\n\nhashmap visualization: ');
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i] !== undefined) {
        lg( buckets[i].toString() );
      } else {
        lg( 'empty bucket' );
      }
    }
  };

  return {
    getBucketsArray: ()=> buckets,
    visualizeHashMap,
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
  };
};

//-----------testing
//customer-item key-value pairs for testing:
//30 + 1 for overwrite / update set() testing
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
  ['David Jackson', 'UPDATE_OVERWRITE_TEST_VALUE'],
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
const namesAndCartItemsHashMap = makeHashMap();
//set test data in hash map
namesAndCartItemsArr.forEach( ([key, value])=> {
  namesAndCartItemsHashMap.set( key, value );
} );
//visualize hash map
namesAndCartItemsHashMap.visualizeHashMap();
lg( `Lucas Young key's value: ${namesAndCartItemsHashMap.get('Lucas Young')}` );
lg( `Ava white key in hash map?: ${ namesAndCartItemsHashMap.has('Ava White') }` );
lg( `Entry for Olivia Davis key removed from hash map?: ${ namesAndCartItemsHashMap.remove('Olivia Davis') }` );
lg( `total keys in hash map: ${namesAndCartItemsHashMap.length()}` );
// namesAndCartItemsHashMap.clear(); //remove all hash map entries
//get array of hash map keys
// lg( namesAndCartItemsHashMap.keys() );
//get array of all hash map values
// lg( namesAndCartItemsHashMap.values() );
//get array of all key-value pair entries
// lg( namesAndCartItemsHashMap.entries() );
