import {factorial, product} from './calculate';
import {test, describe, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope

test ('5! is 120', () => {
    expect(factorial(5)).toBe(120)
});


test ('Product', () => {
    expect(product(2,(k)=>k*2,5)).toBe(10)
})