// 'use strict' not enforced
// enable

// error:
//   camelcase
//   space-before-function-paren
function lorem_ipsum(arg) {
  // do stuff
}
lorem_ipsum()

// error:
//   brace-style
//   space-after-keywords
if(true)
{
  //do something
}
else {
  // do something else
}

// error: semi
1;

// error: comma-spacing
const commaSpacing = ['foo','bar']
commaSpacing

// warning: no-var
var myVar
myVar

// warning: prefer-const
let shouldBeConst = 5
shouldBeConst

// error: no-array-constructor
Array(0, 1, 2)
// this is okay
const arrayConst = new Array(50)
arrayConst

// error: eqeqeq
arrayConst == myVar
// this is okay
myVar == null

// error: comma-dangle (always-multiline)
const commaDangle = {
    bar: 'baz',
    qux: 'quux'
}
commaDangle
// this is okay
const singleLineNoComma = [1, 2]
singleLineNoComma

// error: comma-style
const commaStyle = ['apples'
                  , 'oranges']
commaStyle
