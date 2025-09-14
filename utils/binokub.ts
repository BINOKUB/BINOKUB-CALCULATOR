
export const calculateBase = (numStr: string): number => {
  let currentNum = BigInt(numStr);

  while (currentNum > 9) {
    let sum = BigInt(0);
    let tempNum = currentNum;
    while (tempNum > 0) {
      sum += tempNum % BigInt(10);
      tempNum /= BigInt(10);
    }
    currentNum = sum;
  }
  return Number(currentNum);
};

export const generateNumber = (digits: number): string => {
  let result = '';
  for (let i = 0; i < digits; i++) {
    // Generate a random digit from 1 to 9, excluding 0.
    result += Math.floor(Math.random() * 9) + 1;
  }
  return result;
};