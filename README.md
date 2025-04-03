# Lab Test Dashboard

![Lab Test Dashboard](./images/MainDashboard.png)

A modern, interactive dashboard for visualizing and tracking laboratory test results over time. This application helps users monitor their health metrics with intuitive visualizations, trend analysis, and customizable dashboards.

## 🌟 Motivation

I created this dashboard because I've accumulated numerous test results from managing my diabetes over the years. Unfortunately, most medical offices don't provide easy access to historical data - test results are typically scattered across individual forms or PDFs, making it difficult to track trends over time. This tool helps consolidate and visualize that data in a meaningful way.

## ✨ Features

- **📊 Comprehensive Test Visualization**: View individual test results with clear visual indicators for acceptable ranges.
- **📈 Multi-Test Comparison**: Compare multiple tests side-by-side to identify correlations.
- **⚙️ Custom Dashboard Builder**: Create personalized dashboards with the tests that matter most to you.
- **📅 Date Range Filtering**: Focus on specific time periods to track changes over time.
- **📱 Responsive Design**: Enjoy a seamless experience across desktop, tablet, and mobile devices.
- **🎨 Modern UI**: Clean, intuitive interface with subtle colors and professional design.
- **🔍 Detailed Test Information**: Access comprehensive details about each test, including reference ranges and notes.

## 📸 Screenshots

![Main Dashboard](./images/MainDashboard.png)
*Main dashboard with test selection and visualizations*

![Test Details](./images/DetailView.png)
*Detailed view of individual test results and metadata*

![Custom Dashboard](./images/CustomDashboard.png)
*Custom dashboard with multiple test visualizations*

![Custom Dashboard](./images/MultiGraphs3.png)
*Display your choice of graphs in the custom dashboard*


## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lab-test-dashboard.git
   cd lab-test-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📊 Data Management

### Demo Data vs. Personal Data

This application is designed to work with two types of data:

- **Demo Data**: Sample lab test data included in the repository as JSON files in `public/data/demo/`. This allows you to explore the application without adding your own data.
- **Personal Data**: Your own lab test results stored as JSON files in `public/data/real/` (in the gitignore file, for privacy).

When viewing demo data, a prominent amber-colored banner appears at the top of the dashboard to clearly indicate you're viewing demonstration data, not real patient information:

![Demo Data Banner](./images/demoBannerImage.png)

### Important: Using Index Files

The application uses `index.json` files in both the demo and real data directories to determine which data files to load. This approach provides several benefits:

1. **File Discovery**: The application only loads files listed in the index, ignoring any temporary or backup files
2. **Loading Order**: Files are loaded in the order they appear in the index
3. **Selective Loading**: You can temporarily disable files by removing them from the index without deleting them

#### How to Use Index Files

Each data directory (`public/data/demo/` and `public/data/real/`) contains an `index.json` file that lists the data files to load:

```json
["file1.json", "file2.json", "file3.json"]
```

**Important Notes:**
- When adding new data files, you MUST update the corresponding `index.json` file to include them
- The `real/index.json` file is tracked by git (but NOT the actual data files)
- Any changes to the structure of your data files should be reflected in the index

#### Git Behavior for Data Files

- `public/data/real/index.json` is tracked by git, allowing for version control of the file list
- All other files in the `public/data/real/` directory are ignored by git (via .gitignore) to protect your privacy
- All files in the `public/data/demo/` directory are tracked by git to provide sample data for users

### Using Your Own Lab Data

To use your own lab test data:

1. Create a directory `public/data/real/` (if it doesn't exist)
2. Add your lab data as one or more JSON files in this directory. Make sure to follow the data structure below.
3. The application will automatically detect and merge all JSON files from this directory
4. If no data is found in the `real` directory, the application will fall back to using the demo data

**Note**: The `public/data/real/` directory is included in `.gitignore` to prevent accidental commits of personal health information. Never commit your personal health data to a public repository.

### Converting Medical Reports to JSON

It's very easy to get your lab data into the required format:

1. Collect your lab test reports (PDFs, images, or even text)
2. Use ChatGPT or a similar AI tool by uploading your reports and asking it to convert the data to the JSON format specified below
3. Save the generated JSON to a file in the `public/data/real/` directory

This approach saves you from manually formatting your data and works well with most standard lab reports.

### Data Structure

#### Type Specification

The lab test dashboard data follows this TypeScript type structure:

```typescript
type LabData = {
  // Array of test definitions
  tests: {
    name: string;                  // Unique name identifying the test
    description: string;           // Description of what the test measures and its purpose
    target: {
      description: string;         // Description of the reference/target range
      range: {
        top?: number;              // Upper limit (optional if open-ended)
        bottom?: number;           // Lower limit (optional if open-ended)
        value: 'Excellent' | 'Acceptable' | 'Bad'; // Interpretation of results in this range
      }[];
    };
    specimenType: 'Blood' | 'Serum' | 'Urine' | 'Other'; // Sample type
    units: string;                 // Units of measurement (e.g., "mmol/L", "μmol/L")
  }[];
  
  // Array of test results
  results: {
    test: string;                  // Must match a test name from the tests array
    date: string;                  // In format 'DD MMM YYYY' (e.g., "15 Jan 2023")
    result: {
      result: number;              // Numeric result value
      resultRange?: {              // Optional - for results reported as ranges
        top?: number;              // Upper bound (e.g., for "< 5" results)
        bottom?: number;           // Lower bound (e.g., for "> 10" results)
      };
      resultValid: boolean;        // Whether the result is valid (false if test failed)
      resultAcceptability: 'Excellent' | 'Acceptable' | 'Bad'; // Based on target ranges
    } | {
      resultValid: false;          // For invalid results
    };
    resultNotes: string;           // Additional notes about this specific result
    additionalInfo: string;        // Any other relevant information
  }[];
}
```

#### Example JSON

Here's a practical example of lab data in the required format:

```json
{
  "tests": [
    {
      "name": "Glucose Fasting",
      "description": "Measures blood sugar levels after an overnight fast to screen for diabetes",
      "target": {
        "description": "Normal fasting glucose range",
        "range": [
          { "top": 3.9, "value": "Bad" },
          { "bottom": 3.9, "top": 5.5, "value": "Excellent" },
          { "bottom": 5.5, "top": 6.9, "value": "Acceptable" },
          { "bottom": 6.9, "value": "Bad" }
        ]
      },
      "specimenType": "Blood",
      "units": "mmol/L"
    },
    {
      "name": "HbA1c",
      "description": "Measure of average blood glucose levels over the past 2-3 months",
      "target": {
        "description": "Glycated hemoglobin target range",
        "range": [
          { "top": 42, "value": "Excellent" },
          { "bottom": 42, "top": 48, "value": "Acceptable" },
          { "bottom": 48, "value": "Bad" }
        ]
      },
      "specimenType": "Blood",
      "units": "mmol/mol"
    }
  ],
  "results": [
    {
      "test": "Glucose Fasting",
      "date": "15 Jan 2023",
      "result": {
        "result": 4.8,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Tested after 12 hour fast",
      "additionalInfo": "Within normal range"
    },
    {
      "test": "Glucose Fasting",
      "date": "22 Apr 2023",
      "result": {
        "result": 5.9,
        "resultValid": true,
        "resultAcceptability": "Acceptable"
      },
      "resultNotes": "Slightly elevated",
      "additionalInfo": "Retest recommended in 3 months"
    },
    {
      "test": "HbA1c",
      "date": "15 Jan 2023",
      "result": {
        "result": 39,
        "resultValid": true,
        "resultAcceptability": "Excellent"
      },
      "resultNotes": "Well controlled",
      "additionalInfo": "Continue current management"
    },
    {
      "test": "HbA1c",
      "date": "15 Jul 2023",
      "result": {
        "resultValid": false
      },
      "resultNotes": "Sample hemolyzed",
      "additionalInfo": "Please retest"
    }
  ]
}
```

### Test Categorization

The dashboard automatically organizes lab tests into logical categories based on their names. Tests are categorized into groups like:

- **Diabetes**: HbA1c, glucose, insulin, etc.
- **Lipids**: Cholesterol, triglycerides, lipoproteins, etc.
- **Kidney**: Creatinine, eGFR, albumin, etc.
- **Thyroid**: TSH, T3, T4, etc.
- **Liver**: Transaminases, bilirubin, etc.
- **Blood Count**: Hemoglobin, platelets, WBC, etc.
- **Electrolytes**: Sodium, potassium, calcium, etc.
- **Iron**: Ferritin, transferrin, etc.
- **Inflammation**: CRP, ESR, etc.
- **Vitamins**: B12, folate, vitamin D, etc.
- **Hormones**: Testosterone, estrogen, cortisol, etc.

This categorization makes it easier to find related tests and helps organize the dashboard interface. Any tests that don't match known categories are placed in an "Other" category.

### Multiple Data Files

You can split your data across multiple JSON files. For example:

1. `test-definitions.json` - Just contains the `tests` array with test definitions
2. `lab-results-2023.json` - Contains results from 2023
3. `lab-results-2024.json` - Contains results from 2024

The application will merge all files found in the directory, combining all tests and results into a single dataset.

## 🧰 Tech Stack

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Static type checking for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Composable charting library built on React components
- **date-fns**: Modern JavaScript date utility library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Recharts](https://recharts.org/) for the charting library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Next.js](https://nextjs.org/) for the React framework
- [date-fns](https://date-fns.org/) for date manipulations

---

Made with ❤️ for better health tracking
