/* eslint-disable max-len */
/**
 * @author S.A.V.I.O.U.R
 * @description COVID-19 CODE CHALLENGE JS VERSION ENTRY
 * @license
 */
// Define Constants
import {
  NORMAL_INFECTION_GROWTH_RATE,
  SEVERE_INFECTION_GROWTH_RATE,
  PERCENTAGE_POSITIVE_CASES,
  PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE,
  PERCENTAGE_HOSPITAL_BED_AVAILABILITY,
  PERCENTAGE_CASES_NEEDS_FOR_VENTILATION
} from './constants';

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
      infectionRatioPerPeriod = (2 ** Math.trunc(numberOfDays / 3));
      break;
    case 'weeks':
      infectionRatioPerPeriod = (2 ** (Math.trunc((numberOfDays * 7) / 3)));
      break;

    default:
      infectionRatioPerPeriod = (2 ** (numberOfDays * 10));
      break;
  }

  return infectionRatioPerPeriod;
}

/**
   * @function calculateIAndReturnPeriods
   * @params numberOfDays, periodType
   * @returns infectionRatioPerPeriod
   * @description normalise the duration input based on periods in days, weeks and months.
   */

function calculateIAndReturnPeriods(numberOfDays, periodType) {
  let infectionRatioPerPeriod = 0;
  switch (periodType) {
    case 'days':
      infectionRatioPerPeriod = numberOfDays;
      break;
    case 'weeks':
      infectionRatioPerPeriod = (Math.trunc(numberOfDays * 7));
      break;

    default:
      infectionRatioPerPeriod = (Math.trunc(numberOfDays * 30));
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
   * @function calculateHospitalBedsAvailability
   * @param sampleCaseData
   * @returns hospitalBedsByRequestedTime
   * @description This is the estimated a 35% bed availability in hospitals for severe COVID-19 positive patients.
   */

function calculateHospitalBedsAvailability() {
  // update impact
  const HOSPITAL_BEDS_AVAILABLE = sampleCaseData.totalHospitalBeds * PERCENTAGE_HOSPITAL_BED_AVAILABILITY;
  const saveNormalHospitalBedAvailable = Math.trunc(HOSPITAL_BEDS_AVAILABLE - estimatesdDataStored.impact.severeCasesByRequestedTime);
  estimatesdDataStored.impact.hospitalBedsByRequestedTime = saveNormalHospitalBedAvailable;
  // update severeImpact
  const saveSevereHospitalBedAvailable = Math.trunc(HOSPITAL_BEDS_AVAILABLE - estimatesdDataStored.severeImpact.severeCasesByRequestedTime);
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
  const saveNormalCasesNeedingICUCare = Math.trunc(estimatesdDataStored.impact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE);
  estimatesdDataStored.impact.casesForICUByRequestedTime = saveNormalCasesNeedingICUCare;
  // update severeImpact
  const saveSeverCasesNeedingICUCare = Math.trunc(estimatesdDataStored.severeImpact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_ICU_CARE);
  estimatesdDataStored.severeImpact.casesForICUByRequestedTime = saveSeverCasesNeedingICUCare;
}

/**
   * @function calculateVentilatorsRequired
   * @param sampleCaseData
   * @returns casesForVentilatorsByRequestedTime
   * @description This is the estimated number of severe positive cases that will require ventilators
   */

function calculateVentilatorsRequired() {
  // update impact
  const saveNormalCasesNeedingVentilators = Math.trunc(estimatesdDataStored.impact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_VENTILATION);
  estimatesdDataStored.impact.casesForVentilatorsByRequestedTime = saveNormalCasesNeedingVentilators;
  // update severeImpact
  const saveSeverCasesNeedingVentilators = Math.trunc(estimatesdDataStored.severeImpact.infectionsByRequestedTime * PERCENTAGE_CASES_NEEDS_FOR_VENTILATION);
  estimatesdDataStored.severeImpact.casesForVentilatorsByRequestedTime = saveSeverCasesNeedingVentilators;
}

/**
   * @function calculateCostImapctOnEconomy
   * @param sampleCaseData
   * @returns dollarsInFlight
   * @description estimate how much money the economy is likely to lose over the said period.
   */

function calculateCostImapctOnEconomy() {
  const PERIOD_IN_FOCUS = calculateIAndReturnPeriods(sampleCaseData.timeToElapse, sampleCaseData.periodType);
  const MAJORITIY_WORKING_POPULATION = sampleCaseData.region.avgDailyIncomePopulation;
  const DAILY_EARNINGS = sampleCaseData.region.avgDailyIncomeInUSD;

  // update impact
  const saveNormalDollarsInFlight = Math.trunc((estimatesdDataStored.impact.infectionsByRequestedTime * MAJORITIY_WORKING_POPULATION * DAILY_EARNINGS) / PERIOD_IN_FOCUS);
  estimatesdDataStored.impact.dollarsInFlight = saveNormalDollarsInFlight;
  // update severeImpact
  const saveSeverDollarInFlight = Math.trunc((estimatesdDataStored.severeImpact.infectionsByRequestedTime * MAJORITIY_WORKING_POPULATION * DAILY_EARNINGS) / PERIOD_IN_FOCUS);
  estimatesdDataStored.severeImpact.dollarsInFlight = saveSeverDollarInFlight;
}

/**
   * @function initCovidEstimator
   * @param data
   * @returns estimatesdDataStored
   * @description estimator entry point
   */

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
    calculateHospitalBedsAvailability();

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
