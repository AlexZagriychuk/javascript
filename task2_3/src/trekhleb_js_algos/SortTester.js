export const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const reverseArr = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
export const notSortedArr = [15, 8, 5, 12, 10, 1, 16, 9, 11, 7, 20, 3, 2, 6, 17, 18, 4, 13, 14, 19];
export const equalArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
export const negativeArr = [-1, 0, 5, -10, 20, 13, -7, 3, 2, -3];
export const negativeArrSorted = [-10, -7, -3, -1, 0, 2, 3, 5, 13, 20];

function arrayEquals(a, b) {
    let arraysAreEqual = Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);

    if(!arraysAreEqual) {
        throw new Error(`Arrays [${a}] and [${b}] are not equal`)
    }
    console.log(`Arrays [${a}] and [${b}] are equal`)
    return true
}

export class SortTester {
  static testSort(SortingClass) {
    const sorter = new SortingClass();

    arrayEquals(sorter.sort([]), []);
    arrayEquals(sorter.sort([1]), [1]);
    arrayEquals(sorter.sort([1, 2]), [1, 2]);
    arrayEquals(sorter.sort([2, 1]), [1, 2]);
    arrayEquals(sorter.sort([3, 4, 2, 1, 0, 0, 4, 3, 4, 2]), [0, 0, 1, 2, 2, 3, 3, 4, 4, 4]);
    arrayEquals(sorter.sort(sortedArr), sortedArr);
    arrayEquals(sorter.sort(reverseArr), sortedArr);
    arrayEquals(sorter.sort(notSortedArr), sortedArr);
    arrayEquals(sorter.sort(equalArr), equalArr);
  }

  static testNegativeNumbersSort(SortingClass) {
    const sorter = new SortingClass();
    arrayEquals(sorter.sort(negativeArr), negativeArrSorted);
  }

  static testSortWithCustomComparator(SortingClass) {
    const callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }
        return a.length < b.length ? -1 : 1;
      },
    };

    const sorter = new SortingClass(callbacks);

    arrayEquals(sorter.sort(['']), ['']);
    arrayEquals(sorter.sort(['a']), ['a']);
    arrayEquals(sorter.sort(['aa', 'a']), ['a', 'aa']);
    arrayEquals(sorter.sort(['aa', 'q', 'bbbb', 'ccc']), ['q', 'aa', 'ccc', 'bbbb']);
    arrayEquals(sorter.sort(['aa', 'aa']), ['aa', 'aa']);
  }

  static testSortStability(SortingClass) {
    const callbacks = {
      compareCallback: (a, b) => {
        if (a.length === b.length) {
          return 0;
        }
        return a.length < b.length ? -1 : 1;
      },
    };

    const sorter = new SortingClass(callbacks);

    arrayEquals(sorter.sort(['bb', 'aa', 'c']), ['c', 'bb', 'aa']);
    arrayEquals(sorter.sort(['aa', 'q', 'a', 'bbbb', 'ccc']), ['q', 'a', 'aa', 'ccc', 'bbbb']);
  }

  static testAlgorithmTimeComplexity(SortingClass, arrayToBeSorted, numberOfVisits) {
    const visitingCallback = jest.fn();
    const callbacks = { visitingCallback };
    const sorter = new SortingClass(callbacks);

    sorter.sort(arrayToBeSorted);

    arrayEquals(visitingCallback).toHaveBeenCalledTimes(numberOfVisits);
  }
}