const {setAudioMode, getNextIndex}  = require('../_utils/audioPlayer');

test('adds 1 + 2 to equal 3', async () => {
  await setAudioMode().toBe(3);
});

test('1 follows 0', () => {
  expect(getNextIndex(0, ['a', 'b', 'c'])).toBe(1);
});

// test('two plus two is four', () => {
//     expect(2 + 2).toBe(4);
// });

// test('object assignment', () => {
//     const data = { one: 1 };
//     data['two'] = 2;
//     expect(data).toEqual({ one: 1, two: 2 });
// });

// test('adding positive numbers is not zero', () => {
//     for (let a = 1; a < 10; a++) {
//         for (let b = 1; b < 10; b++) {
//             expect(a + b).not.toBe(0);
//         }
//     }
// });

// test('null', () => {
//     const n = null;
//     expect(n).toBeNull();
//     expect(n).toBeDefined();
//     expect(n).not.toBeUndefined();
//     expect(n).not.toBeTruthy();
//     expect(n).toBeFalsy();
//   });
  
//   test('zero', () => {
//     const z = 0;
//     expect(z).not.toBeNull();
//     expect(z).toBeDefined();
//     expect(z).not.toBeUndefined();
//     expect(z).not.toBeTruthy();
//     expect(z).toBeFalsy();
//   });

//   test('there is no I in team', () => {
//     expect('team').not.toMatch(/I/);
//   });
  
//   test('but there is a "stop" in Christoph', () => {
//     expect('Christoph').toMatch(/stop/);
//   });

//   const shoppingList = [
//     'diapers',
//     'kleenex',
//     'trash bags',
//     'paper towels',
//     'beer',
//   ];
  
//   test('the shopping list has beer on it', () => {
//     expect(shoppingList).toContain('beer');
//     expect(new Set(shoppingList)).toContain('beer');
//   });

//   function compileAndroidCode() {
//     throw new Error('you are using the wrong JDK');
//   }
  
//   test('compiling android goes as expected', () => {
//     expect(compileAndroidCode).toThrow();
//     expect(compileAndroidCode).toThrow(Error);
  
//     // You can also use the exact error message or a regexp
//     expect(compileAndroidCode).toThrow('you are using the wrong JDK');
//     expect(compileAndroidCode).toThrow(/JDK/);
//   });