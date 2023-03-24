import BubbleSort from "./trekhleb_js_algos/BubbleSort.js";
import SelectionSort from "./trekhleb_js_algos/SelectionSort.js";
import InsertionSort from "./trekhleb_js_algos/InsertionSort.js";
import QuickSort from "./trekhleb_js_algos/QuickSort.js";
import QuickSortInPlace from "./trekhleb_js_algos/QuickSortInPlace.js";
import MergeSort from "./trekhleb_js_algos/MergeSort.js";
import { SortTester } from "./trekhleb_js_algos/SortTester.js";


// Generates a random int (both min and max are inclusive in the range)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateArrWithRandomInts(arrLength, minIntValue, maxIntValue) {
    let arr = new Array(arrLength)
    for(let i = 0; i < arrLength; i++) {
        arr[i] = getRandomIntInclusive(minIntValue, maxIntValue)
    }
    return arr
}

function generateAndSortArrays(sortingAlgosArr, numberOfArraysToGenerate, arrayLength, maxIntValue) {
    for(let i = 0; i < numberOfArraysToGenerate; i++) {
        // Generating an array which every sorting algo will sort
        let generatedArr = generateArrWithRandomInts(arrayLength, 1, maxIntValue)

        sortingAlgosArr.forEach(sortingAlgo => {
            // Copy the generated arr before each sorting algorithm to not disturb the originally generated array 
            let generatedArrCopy = [...generatedArr]
            
            // Execute the sorting algorithm and count the elapsed time in ms
            let startTime = performance.now()
            new sortingAlgo.algorithm().sort(generatedArrCopy)
            let endTime = performance.now()
            let timeDiffInMs = endTime - startTime

            sortingAlgo.elapsedTimes.push(timeDiffInMs)
        });
    }
}

function verifyInputParamIsPositiveInteger(inputParamName, inputParamValue) {
    if(!Number.isInteger(inputParamValue) || inputParamValue < 1) {
        throw new Error(`Parameter '${inputParamName}' has value '${inputParamValue}' which is not a positive integer`)
    }
}

function verifyTheExperimentInputParams(numberOfArraysToGenerate, arrayLength, maxIntValue) {
    // Input params must be positive integers
    verifyInputParamIsPositiveInteger("numberOfArraysToGenerate", numberOfArraysToGenerate)
    verifyInputParamIsPositiveInteger("arrayLength", arrayLength)
    verifyInputParamIsPositiveInteger("maxIntValue", maxIntValue)

    // Intentionally limiting the experiment input values to avoid very long execution time
    // (number of elements in each array ^ 2) * number of arrays generated must be <= MAX_ALLOWED_COMPLEXITY
    const MAX_ALLOWED_COMPLEXITY = 10000000000 // for example: number of elements in each array = 10000, number of arrays generated = 100
    
    let complexity = Math.pow(arrayLength, 2) * numberOfArraysToGenerate
    if(complexity > MAX_ALLOWED_COMPLEXITY) {
        throw new Error(`The experiment input parameters are too high (arrayLength = ${arrayLength}; numberOfArraysToGenerate = ${numberOfArraysToGenerate}). These 2 parameters must not exceed the MAX_ALLOWED_COMPLEXITY value ${MAX_ALLOWED_COMPLEXITY} by using this math formula: '(arrayLength ^ 2) * numberOfArraysToGenerate`)
    }
}

function runTheSortingExperiment(sortingAlgosArr, numberOfArraysToGenerate, arrayLength, maxIntValue) {
    let experimentResultsMsgs = []
    
    verifyTheExperimentInputParams(numberOfArraysToGenerate, arrayLength, maxIntValue)

    console.log("------------------------------------")
    let inputParamsInfo = `Sorting algorithms time estimation experiment inputs: number of arrays generated = ${ARRAYS_COUNT}, number of elements in each array = ${ARR_LENGTH}, range of random integers used as elements of arrays = 1 to ${MAX_VALUE}.`
    experimentResultsMsgs.push(inputParamsInfo)
    console.log(inputParamsInfo)
    console.log("------------------------------------")
    console.log("Running the experiment...")

    let experimentStartTime = performance.now()
    generateAndSortArrays(sortingAlgosArr, numberOfArraysToGenerate, arrayLength, maxIntValue)
    let experimentEndTime = performance.now()
    let experimentTimeDiffInMs = experimentEndTime - experimentStartTime

    experimentResultsMsgs.push(`Results of the experiment: total sorting time in ms = ${experimentTimeDiffInMs.toFixed(3)}; average sorting time in ms for each algorithm:`)
    sortingAlgosArr.forEach(sortingAlgo => {
        let nonZeroElapsedTimes = sortingAlgo.elapsedTimes.filter(elapsedTime => elapsedTime !== 0)
        let totalAlgoElapsedTimeInMs = nonZeroElapsedTimes.reduce((acc, val) => acc + val, 0)
        let averageElapsedTime = totalAlgoElapsedTimeInMs / nonZeroElapsedTimes.length

        let zeroElapsedTimeCount = sortingAlgo.elapsedTimes.length - nonZeroElapsedTimes.length
        let zeroElapsedTimeRelatedMsg = zeroElapsedTimeCount === 0 ? "" : `(${zeroElapsedTimeCount} results have 0 ms elapsed time, these results have not been used to calculate the average sorting time; to reduce the number of results with 0 ms elapsed time you can increase the 'number of elements in each array')` 
        
        experimentResultsMsgs.push(`- ${sortingAlgo.algorithm.name}: ${averageElapsedTime.toFixed(3)} ms ${zeroElapsedTimeRelatedMsg}`)
    })

    experimentResultsMsgs.forEach(experimentResult => console.log(experimentResult))

    return experimentResultsMsgs
}


const ARRAYS_COUNT = 10
const ARR_LENGTH  = 10_000
const MAX_VALUE = 1_000_000

const SORTING_ALGOS = [
    {"algorithm": BubbleSort, "elapsedTimes": []},
    {"algorithm": SelectionSort, "elapsedTimes": []},
    {"algorithm": InsertionSort, "elapsedTimes": []},
    {"algorithm": QuickSort, "elapsedTimes": []},
    {"algorithm": QuickSortInPlace, "elapsedTimes": []},
    {"algorithm": MergeSort, "elapsedTimes": []},
]

document.getElementById("run-experiment").addEventListener("click", event => {
    let statusMsgElem = document.getElementById("status-message")
    //ToDo: figure out why this text is not appearing in the "status-message" elem while the experiment is running
    statusMsgElem.textContent = "Running the experiment..."

    try {
        let experimentResults = runTheSortingExperiment(SORTING_ALGOS, ARRAYS_COUNT, ARR_LENGTH, MAX_VALUE)
        statusMsgElem.textContent = experimentResults.join("\n")
    } catch(error) {
        statusMsgElem.textContent = error.message
    }
})
