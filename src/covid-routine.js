/* eslint-disable max-len */
import {
  NORMAL_INFECTION_GROWTH_RATE,
  SEVERE_INFECTION_GROWTH_RATE,
  PERCENTAGE_POSITIVE_CASES,
  PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE,
  PERCENTAGE_HOSPITAL_BED_AVAILABILITY,
  PERCENTAGE_CASES_NEEDS_FOR_VENTILATION
} from './constants';

// let sampleCaseData = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 5,
//     avgDailyIncomePopulation: 0.71
//   },
//   periodType: 'days',
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   totalHospitalBeds: 1380614
// };
let sampleCaseData = {};
let estimatesdDataStored = {};

/**
 * @function calculateCurrentlyInfected
 * @param sampleCaseData
 * @returns currentlyInfected
 * @description estimates and saves  the number of currently and severly infected people
 */
function calculateCurrentlyInfected() {
  // update impact
  const saveCurrentlyInfected = sampleCaseData.reportedCases * NORMAL_INFECTION_GROWTH_RATE;
  estimatesdDataStored.impact.currentlyInfected = saveCurrentlyInfected;
  // update severeImpact
  const saveSeverelyInfected = sampleCaseData.reportedCases * SEVERE_INFECTION_GROWTH_RATE;
  estimatesdDataStored.severeImpact.currentlyInfected = saveSeverelyInfected;
}

/**
 * @function calculateInfectionRatesPerPeriod
 * @params numberOfDays, periodType
 * @returns infectionRatioPerPeriod
 * @description normalise the duration input to days, and then do your computation based on periods in days, weeks and months.
 */

function calculateInfectionRatesPerPeriod(numberOfDays, periodType) {
  let infectionRatioPerPeriod = 0;
  switch (periodType) {
    case 'days':
      infectionRatioPerPeriod = (2 ** (Math.round(numberOfDays / 3)));
      break;
    case 'weeks':
      infectionRatioPerPeriod = (2 ** (Math.round((numberOfDays * 7) / 3)));
      break;

    default:
      infectionRatioPerPeriod = (2 ** (numberOfDays * 10));
      break;
  }

  return infectionRatioPerPeriod;
}

/**
 * @function calculatePossibleInfectionGrowthRate
 * @param sampleCaseData
 * @returns infectionsByRequestedTime
 * @description To estimate the number of infected people 30 days from now,
 */

function calculatePossibleInfectionGrowthRate() {
  const INFECTION_RATE_PER_PERIOD = calculateInfectionRatesPerPeriod(sampleCaseData.timeToElapse, sampleCaseData.periodType);
  // update impact
  const saveNormalSpreadRate = estimatesdDataStored.impact.currentlyInfected * INFECTION_RATE_PER_PERIOD;
  estimatesdDataStored.impact.infectionsByRequestedTime = saveNormalSpreadRate;
  // update severeImpact
  const saveSevereSpreadRate = estimatesdDataStored.severeImpact.currentlyInfected * INFECTION_RATE_PER_PERIOD;
  estimatesdDataStored.severeImpact.infectionsByRequestedTime = saveSevereSpreadRate;
}

/**
 * @function calculateSevereCases
 * @param sampleCaseData
 * @returns severeCasesByRequestedTime
 * @description This is the estimated number of severe positive cases that will require hospitalization to recover.
 */

function calculateSevereCases() {
  // update impact
  const estimatedNormalPositive = estimatesdDataStored.impact.infectionsByRequestedTime * PERCENTAGE_POSITIVE_CASES;
  estimatesdDataStored.impact.severeCasesByRequestedTime = estimatedNormalPositive;

  // update severeImpact
  const estimatedSeverePositive = estimatesdDataStored.severeImpact.infectionsByRequestedTime * PERCENTAGE_POSITIVE_CASES;
  estimatesdDataStored.severeImpact.severeCasesByRequestedTime = estimatedSeverePositive;
}

/**
 * @function caclulatHospitalBedsAvailability
 * @param sampleCaseData
 * @returns hospitalBedsByRequestedTime
 * @description This is the estimated a 35% bed availability in hospitals for severe COVID-19 positive patients.
 */

function caclulateHospitalBedsAvailability() {
  // update impact
  const HOSPITAL_BEDS_AVAILABLE = sampleCaseData.totalHospitalBeds * PERCENTAGE_HOSPITAL_BED_AVAILABILITY;
  const saveNormalHospitalBedAvailable = estimatesdDataStored.impact.severeCasesByRequestedTime - HOSPITAL_BEDS_AVAILABLE;
  estimatesdDataStored.impact.hospitalBedsByRequestedTime = saveNormalHospitalBedAvailable;
  // update severeImpact
  const saveSevereHospitalBedAvailable = estimatesdDataStored.severeImpact.severeCasesByRequestedTime - HOSPITAL_BEDS_AVAILABLE;
  estimatesdDataStored.severeImpact.hospitalBedsByRequestedTime = saveSevereHospitalBedAvailable;
}

/**
 * @function calculationICURequirement
 * @param sampleCaseData
 * @returns casesForICUByRequestedTime
 * @description This is the estimated number of severe positive cases that will require ICU care.
 */

function calculationICURequirement() {
  // update impact
  const saveNormalCasesNeadingICUCare = estimatesdDataStored.impact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE;
  estimatesdDataStored.impact.casesForICUByRequestedTime = saveNormalCasesNeadingICUCare;
  // update severeImpact
  const saveSeverCasesNeadingICUCare = estimatesdDataStored.severeImpact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE;
  estimatesdDataStored.severeImpact.casesForICUByRequestedTime = saveSeverCasesNeadingICUCare;
}

/**
 * @function calculateVentilatorsRequired
 * @param sampleCaseData
 * @returns casesForVentilatorsByRequestedTime
 * @description This is the estimated number of severe positive cases that will require ventilators
 */

function calculateVentilatorsRequired() {
  // update impact
  const saveNormalCasesNeedingVentilators = estimatesdDataStored.impact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_VENTILATION;
  estimatesdDataStored.impact.casesForVentilatorsByRequestedTime = saveNormalCasesNeedingVentilators;
  // update severeImpact
  const saveSeverCasesNeedingVentilators = estimatesdDataStored.severeImpact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_VENTILATION;
  estimatesdDataStored.severeImpact.casesForVentilatorsByRequestedTime = saveSeverCasesNeedingVentilators;
}

/**
 * @function calculateCostImapctOnEconomy
 * @param sampleCaseData
 * @returns dollarsInFlight
 * @description estimate how much money the economy is likely to lose over the said period.
 */

function calculateCostImapctOnEconomy() {
  const MAJORITIY_WORKING_POPULATION = sampleCaseData.region.avgDailyIncomePopulation;
  const DAILY_EARNINGS = sampleCaseData.region.avgDailyIncomeInUSD;
  const PERIOD_IN_FOCUS = 30;
  // update impact
  const saveNormalDollarsInFlight = estimatesdDataStored.impact.infectionsByRequestedTime * MAJORITIY_WORKING_POPULATION
    * DAILY_EARNINGS * PERIOD_IN_FOCUS;
  estimatesdDataStored.impact.dollarsInFlight = saveNormalDollarsInFlight;
  // update severeImpact
  const saveSeverDollarInFlight = estimatesdDataStored.severeImpact.infectionsByRequestedTime * MAJORITIY_WORKING_POPULATION * DAILY_EARNINGS * PERIOD_IN_FOCUS;
  estimatesdDataStored.severeImpact.dollarsInFlight = saveSeverDollarInFlight;
}

function initCovidEstimator(data) {
  if (data instanceof Object && data !== null) {
    // initialize variables
    sampleCaseData = data;
    estimatesdDataStored = {
      data: sampleCaseData, // the input data you got
      impact: {}, // your best case estimation
      severeImpact: {} // your severe case estimation
    };
    // compute code challenge -1
    calculateCurrentlyInfected();
    calculatePossibleInfectionGrowthRate();

    // compute code challenge -2
    calculateSevereCases();
    caclulateHospitalBedsAvailability();

    // compute code challenge -3
    calculationICURequirement();
    calculateVentilatorsRequired();
    calculateCostImapctOnEconomy();

    // return responses
    return estimatesdDataStored;
  }
  throw new Error('Error in data Entry');
}

export default initCovidEstimator;
