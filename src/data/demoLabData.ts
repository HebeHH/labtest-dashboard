import { AllResults } from '../types/labDataTypes';

const demoLabResults: AllResults = {
  "tests": [
    {
      "name": "Glucose, Fasting",
      "description": "Measures blood sugar levels after fasting for at least 8 hours. Used to diagnose and monitor diabetes.",
      "target": {
        "description": "Reference ranges for fasting glucose based on clinical guidelines.",
        "range": [
          {
            "top": 3.9,
            "value": "Bad"
          },
          {
            "bottom": 3.9,
            "top": 5.5,
            "value": "Excellent"
          },
          {
            "bottom": 5.5,
            "top": 7.0,
            "value": "Acceptable"
          },
          {
            "bottom": 7.0,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MMOL/L"
    },
    {
      "name": "Hemoglobin A1c",
      "description": "Measures average blood glucose levels over the past 2-3 months. Primary test for diabetes management.",
      "target": {
        "description": "Target ranges for HbA1c based on diabetes management guidelines.",
        "range": [
          {
            "top": 5.7,
            "value": "Excellent"
          },
          {
            "bottom": 5.7,
            "top": 6.4,
            "value": "Acceptable"
          },
          {
            "bottom": 6.4,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "%"
    },
    {
      "name": "Total Cholesterol",
      "description": "Measures all types of cholesterol in the blood. Important for assessing cardiovascular risk.",
      "target": {
        "description": "Reference ranges for total cholesterol based on cardiovascular health guidelines.",
        "range": [
          {
            "top": 5.2,
            "value": "Excellent"
          },
          {
            "bottom": 5.2,
            "top": 6.2,
            "value": "Acceptable"
          },
          {
            "bottom": 6.2,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MMOL/L"
    },
    {
      "name": "HDL Cholesterol",
      "description": "High-density lipoprotein cholesterol, often called 'good' cholesterol, helps remove other forms of cholesterol from the bloodstream.",
      "target": {
        "description": "Reference ranges for HDL cholesterol based on cardiovascular health guidelines.",
        "range": [
          {
            "top": 1.0,
            "value": "Bad"
          },
          {
            "bottom": 1.0,
            "top": 1.5,
            "value": "Acceptable"
          },
          {
            "bottom": 1.5,
            "value": "Excellent"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MMOL/L"
    },
    {
      "name": "LDL Cholesterol",
      "description": "Low-density lipoprotein cholesterol, often called 'bad' cholesterol, can build up in arteries and increase risk of heart disease.",
      "target": {
        "description": "Reference ranges for LDL cholesterol based on cardiovascular health guidelines.",
        "range": [
          {
            "top": 2.6,
            "value": "Excellent"
          },
          {
            "bottom": 2.6,
            "top": 3.3,
            "value": "Acceptable"
          },
          {
            "bottom": 3.3,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MMOL/L"
    },
    {
      "name": "Triglycerides",
      "description": "Type of fat found in the blood that can increase risk of heart disease when elevated.",
      "target": {
        "description": "Reference ranges for triglycerides based on cardiovascular health guidelines.",
        "range": [
          {
            "top": 1.7,
            "value": "Excellent"
          },
          {
            "bottom": 1.7,
            "top": 2.2,
            "value": "Acceptable"
          },
          {
            "bottom": 2.2,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MMOL/L"
    },
    {
      "name": "Thyroid Stimulating Hormone",
      "description": "Measures TSH levels to assess thyroid function. TSH stimulates the thyroid to produce thyroid hormones.",
      "target": {
        "description": "Reference ranges for TSH based on thyroid function guidelines.",
        "range": [
          {
            "top": 0.4,
            "value": "Bad"
          },
          {
            "bottom": 0.4,
            "top": 4.0,
            "value": "Excellent"
          },
          {
            "bottom": 4.0,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "MU/L"
    },
    {
      "name": "Vitamin D, 25-Hydroxy",
      "description": "Measures vitamin D levels to assess bone health and immune function.",
      "target": {
        "description": "Reference ranges for vitamin D based on clinical guidelines for optimal health.",
        "range": [
          {
            "top": 50,
            "value": "Bad"
          },
          {
            "bottom": 50,
            "top": 75,
            "value": "Acceptable"
          },
          {
            "bottom": 75,
            "top": 125,
            "value": "Excellent"
          },
          {
            "bottom": 125,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "NMOL/L"
    },
    {
      "name": "Iron",
      "description": "Measures the amount of iron in the blood. Important for assessing anemia and iron overload conditions.",
      "target": {
        "description": "Reference ranges for serum iron based on hematology guidelines.",
        "range": [
          {
            "top": 11.0,
            "value": "Bad"
          },
          {
            "bottom": 11.0,
            "top": 30.0,
            "value": "Excellent"
          },
          {
            "bottom": 30.0,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "UMOL/L"
    },
    {
      "name": "Creatinine",
      "description": "Measures kidney function by assessing how well they filter creatinine, a waste product, from the blood.",
      "target": {
        "description": "Reference ranges for creatinine based on kidney function guidelines.",
        "range": [
          {
            "top": 45,
            "value": "Bad"
          },
          {
            "bottom": 45,
            "top": 90,
            "value": "Excellent"
          },
          {
            "bottom": 90,
            "value": "Bad"
          }
        ]
      },
      "specimenType": "Blood",
      "units": "UMOL/L"
    }
  ],
  "results": [
    // Glucose Results
    {
      "test": "Glucose, Fasting",
      "date": "12 Jun 2025",
      "result": {
        "result": 5.2,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Fasting sample taken after 10 hours",
      "additionalInfo": "Results within normal range"
    },
    {
      "test": "Glucose, Fasting",
      "date": "10 Mar 2025",
      "result": {
        "result": 5.8,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Patient reported 8 hour fast",
      "additionalInfo": "Trending higher than previous results"
    },
    {
      "test": "Glucose, Fasting",
      "date": "15 Dec 2024",
      "result": {
        "result": 5.3,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Proper fasting confirmed",
      "additionalInfo": "Within target range"
    },
    {
      "test": "Glucose, Fasting",
      "date": "22 Sep 2024",
      "result": {
        "result": 6.1,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Consider dietary changes",
      "additionalInfo": "Patient reports higher carbohydrate intake recently"
    },
    
    // A1c Results
    {
      "test": "Hemoglobin A1c",
      "date": "12 Jun 2025",
      "result": {
        "result": 5.4,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Excellent glycemic control",
      "additionalInfo": "Continue current management"
    },
    {
      "test": "Hemoglobin A1c",
      "date": "10 Mar 2025",
      "result": {
        "result": 5.8,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Slightly elevated",
      "additionalInfo": "Consider dietary and lifestyle assessment"
    },
    {
      "test": "Hemoglobin A1c",
      "date": "15 Dec 2024",
      "result": {
        "result": 5.5,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Good control",
      "additionalInfo": "Continue monitoring"
    },
    {
      "test": "Hemoglobin A1c",
      "date": "22 Sep 2024",
      "result": {
        "result": 6.2,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Upper limit of acceptable range",
      "additionalInfo": "Consider dietary counseling"
    },
    
    // Cholesterol Panel Results
    {
      "test": "Total Cholesterol",
      "date": "12 Jun 2025",
      "result": {
        "result": 4.8,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Within target range",
      "additionalInfo": "Good cardiovascular risk profile"
    },
    {
      "test": "Total Cholesterol",
      "date": "15 Dec 2024",
      "result": {
        "result": 5.5,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Slightly elevated",
      "additionalInfo": "Consider dietary changes"
    },
    {
      "test": "HDL Cholesterol",
      "date": "12 Jun 2025",
      "result": {
        "result": 1.8,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Excellent HDL level",
      "additionalInfo": "Continue current healthy habits"
    },
    {
      "test": "HDL Cholesterol",
      "date": "15 Dec 2024",
      "result": {
        "result": 1.3,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Consider increasing physical activity",
      "additionalInfo": "Moderate cardiovascular risk profile"
    },
    {
      "test": "LDL Cholesterol",
      "date": "12 Jun 2025",
      "result": {
        "result": 2.5,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Within optimal range",
      "additionalInfo": "Low cardiovascular risk"
    },
    {
      "test": "LDL Cholesterol",
      "date": "15 Dec 2024",
      "result": {
        "result": 3.2,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Consider dietary modifications",
      "additionalInfo": "Moderate cardiovascular risk"
    },
    {
      "test": "Triglycerides",
      "date": "12 Jun 2025",
      "result": {
        "result": 1.5,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Within optimal range",
      "additionalInfo": "Continue current diet"
    },
    {
      "test": "Triglycerides",
      "date": "15 Dec 2024",
      "result": {
        "result": 1.9,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Slightly elevated",
      "additionalInfo": "Consider reducing refined carbohydrates"
    },
    
    // Thyroid Results
    {
      "test": "Thyroid Stimulating Hormone",
      "date": "12 Jun 2025",
      "result": {
        "result": 2.1,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Normal thyroid function",
      "additionalInfo": "No further action required"
    },
    {
      "test": "Thyroid Stimulating Hormone",
      "date": "10 Mar 2025",
      "result": {
        "result": 3.8,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Within normal range",
      "additionalInfo": "Continue monitoring"
    },
    {
      "test": "Thyroid Stimulating Hormone",
      "date": "15 Dec 2024",
      "result": {
        "result": 4.2,
        "resultValid": true,
        "resultAcceptability": "Bad"
      },
      "resultNotes": "Slightly elevated, subclinical hypothyroidism possible",
      "additionalInfo": "Consider follow-up testing"
    },
    
    // Vitamin D Results
    {
      "test": "Vitamin D, 25-Hydroxy",
      "date": "12 Jun 2025",
      "result": {
        "result": 85,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Optimal vitamin D level",
      "additionalInfo": "Continue current supplementation"
    },
    {
      "test": "Vitamin D, 25-Hydroxy",
      "date": "15 Dec 2024",
      "result": {
        "result": 45,
        "resultValid": true,
        "resultAcceptability": "Bad"
      },
      "resultNotes": "Insufficient vitamin D",
      "additionalInfo": "Consider vitamin D supplementation"
    },
    {
      "test": "Vitamin D, 25-Hydroxy",
      "date": "22 Sep 2024",
      "result": {
        "result": 62,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Adequate vitamin D level",
      "additionalInfo": "Continue current regimen"
    },
    
    // Iron Results
    {
      "test": "Iron",
      "date": "12 Jun 2025",
      "result": {
        "result": 18.5,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Normal iron levels",
      "additionalInfo": "No action required"
    },
    {
      "test": "Iron",
      "date": "15 Dec 2024",
      "result": {
        "result": 10.2,
        "resultValid": true,
        "resultAcceptability": "Bad"
      },
      "resultNotes": "Low iron level",
      "additionalInfo": "Consider iron supplementation and dietary changes"
    },
    {
      "test": "Iron",
      "date": "22 Sep 2024",
      "result": { 
        "resultValid": false 
      },
      "resultNotes": "Sample hemolyzed",
      "additionalInfo": "Please retest"
    },
    
    // Creatinine Results
    {
      "test": "Creatinine",
      "date": "12 Jun 2025",
      "result": {
        "result": 75,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Normal kidney function",
      "additionalInfo": "Continue current monitoring"
    },
    {
      "test": "Creatinine",
      "date": "10 Mar 2025",
      "result": {
        "result": 78,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Normal kidney function",
      "additionalInfo": "No further action required"
    },
    {
      "test": "Creatinine",
      "date": "15 Dec 2024",
      "result": {
        "result": 95,
        "resultValid": true,
        "resultAcceptability": "Bad"
      },
      "resultNotes": "Slightly elevated",
      "additionalInfo": "Ensure adequate hydration and retest in 3 months"
    }
  ]
};

export default demoLabResults; 