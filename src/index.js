/* Next task:
- Done
*/

//Imports
//For Node.js, when importing local modules, include the file extension in the import statement
import { logToConsole as lg } from './logger.js'; //shorthand loggers
import makeLinkedList from './linkedList.js'; //default import example

//string hashing fn returns hashcode which is also bucket address. Passing in bucket
//capacity here to use the modulo operator in each loop; this keeps the numbers small
//for JS accuracy and also prevents them ever being more than capacity.
const getHashCode = (key, capacity)=> {
  // if (typeof key !== 'string') { lg( key ); throw new Error('111... Key must be a string.'); }
  let hashCode = 0;
  for ( let i = 0; i < key.length; i++ ) {
    //31 is a common odd prime number related to alphabet size used in hashing functions
    //can also try changing it to another prime number. popular: 17,31,37,41
    hashCode = (17 * hashCode + key.charCodeAt(i)) % capacity;
  }
  // lg( `hashCode: ${ hashCode }` );
  //test hashcodes are within bounds before returning them
  if ( hashCode < 0 || hashCode >= capacity ) throw new Error('hash has led to an index out of bounds');
  return hashCode;
};

//hashmap creation factory fn, yay no overthinking 'this'.
const makeHashMap = ()=> {
  //start with a default array of size 16 for the buckets. JS let's you write values
  // wherever you want in arrays, but not all programming languages will.
  let currentBucketSize = 16;
  // let currentBucketSize = 2; //use this smaller size for debugging
  let buckets = new Array( currentBucketSize ); //or use Array.from() for mapping fn if needed
  const keySet = new Set();
  const loadFactor = 0.75;

  //fn to set key-value pair arr value in bucket within a node
  const set = (key, value)=> {
    if (typeof value !== 'string') { lg( value ); throw new Error('111... Value must be a string.'); }
    let bucketIndex = getHashCode(key, buckets.length);
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
    } else { //new key: add new entry to hash map and key to keySet Set
      keySet.add(key); //add key to set
      //before checking load factor, set the value in the bucket
      if ( buckets[bucketIndex] === undefined ) { //when bucket empty
        const newLinkedList = makeLinkedList(); //make linked list
        newLinkedList.append( [key, value] ); //add node. value = key-value pair array
        buckets[bucketIndex] = newLinkedList;
      } else { //handle occupied bucket collisions by appending to their linked list
        buckets[bucketIndex].append( [key, value] );
      }
      //now check load factor. if it has been passed, then rehash and insert existing
      //entries to new buckets
      if ( keySet.size / buckets.length > loadFactor ) {
        lg(`loadfactor exceeded: copying entries to ${ currentBucketSize * 2
        } new buckets...`);
        //make temporary double size bucket array
        currentBucketSize *= 2;
        const tempDoubledBuckets = new Array( currentBucketSize );
        //iterate over all old buckets to access values in linked list nodes
        buckets.forEach( (linkedList)=> { //cb is not invoked for empty bucket array slots
          let currentNode = linkedList.getHead();
          while ( currentNode ) { // linked list node traversal loop
            //hash key and calculate index to store in doubled bucket array
            if (typeof currentNode.value[0] !== 'string') { //debugging
              lg( currentNode.value[0] );
              throw new Error('333... Key must be a string.');
            }
            bucketIndex = getHashCode( currentNode.value[0], tempDoubledBuckets.length );
            //if bucket is empty, create linked list
            if ( tempDoubledBuckets[bucketIndex] === undefined ) {
              const newLinkedList = makeLinkedList();
              //add node to list with value from old node, which is the key-value pair ARRAY
              //you had a bug before here where the value was an array inside another array.
              newLinkedList.append( currentNode.value );
              tempDoubledBuckets[bucketIndex] = newLinkedList;
            } else { //handle collisions by appending a new node
              tempDoubledBuckets[bucketIndex].append( currentNode.value );
            }
            currentNode = currentNode.next;
          }
        } );
        buckets = tempDoubledBuckets; //swap buckets
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
//24 normal + 1 to test overwrite
const namesAndCartItemsArr = [
  ['John Smith', 'Toilet Paper'],
  ['Emily Johnson', 'Bottled Water'],
  ['Michael Williams', 'Rice'],
  ['David Jackson', 'Pasta'],
  ['David Jackson', 'UPDATE_OVERWRITE_TEST'],
  ['Emma Jones', 'Chicken Breasts'],
  ['Olivia Davis', 'Bananas'],
  ['Ava White', 'Tomatoes'],
  ['Charlotte Martinez', 'Coffee'],
  ['Amelia Garcia', 'Paper Towels'],
  ['Ella Lee', 'Salmon'],
  ['Lily Rodriguez', 'Avocado'],
  ['Christopher Lewis', 'Potatoes'],
  ['Grace Walker', 'Cucumber'],
  ['Andrew Hall', 'Onions'],
  ['Lucas Young', 'Peanut Butter'],
  ['Evelyn King', 'Broccoli'],
  ['Jackson Scott', 'Ground Turkey'],
  ['Priya Patel', 'Curry'],
  ['Luis Hernandez', 'Tortillas'],
  ['Sven Olsen', 'Smorrebrod'],
  ['Chen Wei', 'Noodles'],
  ['Ananya Gupta', 'Chutney'],
  ['Muhammad Khan', 'Kebab'],
  ['Santiago Rodriguez', 'Empanadas']
];

//hash fn test from string key with starting capacity of 16
// lg( `'John Smith' hash: ${ getHashCode( namesAndCartItemsArr[0][0], 16 )}` );
// lg( getHashCode( 'JohnSmith' ) ); //hash fn test: no space
// lg( getHashCode( 'SmithJohn' ) ); //hash fn test: permutation
const namesAndCartItemsHashMap = makeHashMap();
//set test data in hash map
namesAndCartItemsArr.forEach( ([key, value])=> {
  namesAndCartItemsHashMap.set( key, value );
} );
//visualize hash map
namesAndCartItemsHashMap.visualizeHashMap();
// lg( `Lucas Young key's value: ${namesAndCartItemsHashMap.get('Lucas Young')}` );
// lg( `Ava white key in hash map?: ${ namesAndCartItemsHashMap.has('Ava White') }` );
// lg( `Entry for Olivia Davis key removed from hash map?: ${
  // namesAndCartItemsHashMap.remove('Olivia Davis') }` );
// namesAndCartItemsHashMap.clear(); //remove all hash map entries
lg( `total keys in hash map: ${namesAndCartItemsHashMap.length()}` );
// get array of all hash map keys
// lg( namesAndCartItemsHashMap.keys() );
// get array of all hash map values
// lg( namesAndCartItemsHashMap.values() );
//get array of all hash map entries, which are key-value pair arrays
// lg( namesAndCartItemsHashMap.entries() );

//******* EXTRA CREDIT hash set factory fn below. JS Set object alternative*******
const makeHashSet = ()=> {
  let set = {}; //based off object to store keys
  //fn to store key as a property with truthy value
  const add = (key)=> { set[key] = true; };
  //fn to check if key exists in the set, use double negation operator to return
  //a boolean based on key's existence in the set
  const has = (key)=> !!set[key];
  //fn to remove key from the set by deleting its property
  const remove = (key)=> { delete set[key]; };
  //fn to remove all keys from the set via reassignment
  const clear = ()=> { set = {}; };
  //fn to return the number of keys in the set
  const size = ()=> Object.keys(set).length;
  //fn to return an array of all keys in the set
  const keys = () => Object.keys(set);
  return {
    add,
    has,
    remove,
    clear,
    size,
    keys,
  };
};
// hash set testing
// const fruitsHashSet = makeHashSet();
// add keys to the set
// fruitsHashSet.add('apple');
// fruitsHashSet.add('banana');
// fruitsHashSet.add('orange');
// Check if keys exist in the set
// lg(fruitsHashSet.has('banana'));
// lg(fruitsHashSet.has('grape'));
// Remove a key from the set
// fruitsHashSet.remove('banana');
// Clear the set, check it's empty
// fruitsHashSet.clear();
// lg(fruitsHashSet.size());
// lg(fruitsHashSet.keys());
