export type OutcomeAcceptability = 'Excellent' | 'Acceptable' | 'Bad';
export type SpecimenType = 'Blood' | 'Serum' | 'Urine' | 'Other';

export type TargetRange = {
    top?: number;
    bottom?: number;
    value: OutcomeAcceptability;
}

export type Target = {
    description: string;
    range: TargetRange[];
}

export type Test = {
    name: string;
    description: string; // description of the test, what it is used for, from your prior knowledge
    target: Target;
    specimenType: SpecimenType;
    units: string;
}

export type ValidResult = {
    result: number; // single number result. If result is '>12', then result is 12.
    resultRange?: { // include if result is a range. Eg '>12' has 'bottom: 12'
        top?: number;
        bottom?: number;
    }
    resultValid: true; // whether the result is valid (false if there was any issue with the test)
    resultAcceptability: OutcomeAcceptability; // based on the result and the target range
}

export type InvalidResult = {
    resultValid: false;
}

export type TestResult = {
    test: string;
    date: string; // in format 'dd MMM yyyy'
    result: ValidResult | InvalidResult;
    resultNotes: string;
    additionalInfo: string; // any additional information about the result
}

export type AllResults = {
    tests: Test[];
    results: TestResult[];
}



