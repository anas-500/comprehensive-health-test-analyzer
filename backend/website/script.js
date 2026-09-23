/* =========================================================
   Comprehensive Health Test Analyzer
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let userId = localStorage.getItem("healthAnalyzerUserId");

if (!userId) {

    userId =
        "user-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10);

    localStorage.setItem(
        "healthAnalyzerUserId",
        userId
    );
}


let goodCount = 0;
let lowCount = 0;
let highCount = 0;
let warningCount = 0;

let abnormalResults = [];

let trendChart = null;


/* =========================================================
   TEST DATABASE
   ========================================================= */

const tests = [

    /* ================= CBC ================= */

    {
        id: "hemoglobin",
        name: "Hemoglobin",
        low: 12,
        high: 17.5,
        unit: "g/dL"
    },

    {
        id: "wbc",
        name: "WBC",
        low: 4,
        high: 11,
        unit: "×10³/µL"
    },

    {
        id: "rbc",
        name: "RBC",
        low: 4,
        high: 6,
        unit: "×10⁶/µL"
    },

    {
        id: "platelets",
        name: "Platelets",
        low: 150,
        high: 450,
        unit: "×10³/µL"
    },

    {
        id: "hematocrit",
        name: "Hematocrit",
        low: 36,
        high: 52,
        unit: "%"
    },

    {
        id: "mcv",
        name: "MCV",
        low: 80,
        high: 100,
        unit: "fL"
    },

    {
        id: "neutrophils",
        name: "Neutrophils",
        low: 40,
        high: 70,
        unit: "%"
    },

    {
        id: "lymphocytes",
        name: "Lymphocytes",
        low: 20,
        high: 40,
        unit: "%"
    },


    /* ================= DIABETES ================= */

    {
        id: "glucose",
        name: "Fasting Blood Glucose",
        low: 70,
        high: 99,
        unit: "mg/dL"
    },


    /* ================= LIPID ================= */

    {
        id: "totalCholesterol",
        name: "Total Cholesterol",
        low: 0,
        high: 199,
        unit: "mg/dL"
    },

    {
        id: "ldl",
        name: "LDL",
        low: 0,
        high: 99,
        unit: "mg/dL"
    },

    {
        id: "hdl",
        name: "HDL",
        low: 40,
        high: 100,
        unit: "mg/dL"
    },

    {
        id: "triglycerides",
        name: "Triglycerides",
        low: 0,
        high: 149,
        unit: "mg/dL"
    },


    /* ================= KIDNEY ================= */

    {
        id: "creatinine",
        name: "Creatinine",
        low: 0.6,
        high: 1.3,
        unit: "mg/dL"
    },

    {
        id: "bun",
        name: "BUN",
        low: 7,
        high: 20,
        unit: "mg/dL"
    },

    {
        id: "egfr",
        name: "eGFR",
        low: 90,
        high: 200,
        unit: "mL/min/1.73m²"
    },

    {
        id: "uricAcid",
        name: "Uric Acid",
        low: 3.5,
        high: 7.2,
        unit: "mg/dL"
    },


    /* ================= LIVER ================= */

    {
        id: "alt",
        name: "ALT",
        low: 7,
        high: 56,
        unit: "U/L"
    },

    {
        id: "ast",
        name: "AST",
        low: 10,
        high: 40,
        unit: "U/L"
    },

    {
        id: "alp",
        name: "ALP",
        low: 44,
        high: 147,
        unit: "U/L"
    },

    {
        id: "bilirubin",
        name: "Total Bilirubin",
        low: 0.1,
        high: 1.2,
        unit: "mg/dL"
    },

    {
        id: "albumin",
        name: "Albumin",
        low: 3.5,
        high: 5,
        unit: "g/dL"
    },

    {
        id: "totalProtein",
        name: "Total Protein",
        low: 6,
        high: 8.3,
        unit: "g/dL"
    },


    /* ================= THYROID ================= */

    {
        id: "tsh",
        name: "TSH",
        low: 0.4,
        high: 4,
        unit: "mIU/L"
    },

    {
        id: "freeT4",
        name: "Free T4",
        low: 0.8,
        high: 1.8,
        unit: "ng/dL"
    },


    /* ================= VITAMINS ================= */

    {
        id: "vitaminD",
        name: "Vitamin D",
        low: 30,
        high: 100,
        unit: "ng/mL"
    },

    {
        id: "vitaminB12",
        name: "Vitamin B12",
        low: 200,
        high: 900,
        unit: "pg/mL"
    },

    {
        id: "folate",
        name: "Folate",
        low: 4,
        high: 20,
        unit: "ng/mL"
    },

    {
        id: "ferritin",
        name: "Ferritin",
        low: 20,
        high: 300,
        unit: "ng/mL"
    },

    {
        id: "iron",
        name: "Iron",
        low: 60,
        high: 170,
        unit: "µg/dL"
    },

    {
        id: "magnesium",
        name: "Magnesium",
        low: 1.7,
        high: 2.2,
        unit: "mg/dL"
    },

    {
        id: "calcium",
        name: "Calcium",
        low: 8.5,
        high: 10.5,
        unit: "mg/dL"
    },

    {
        id: "phosphorus",
        name: "Phosphorus",
        low: 2.5,
        high: 4.5,
        unit: "mg/dL"
    },


    /* ================= INFLAMMATION ================= */

    {
        id: "crp",
        name: "CRP",
        low: 0,
        high: 5,
        unit: "mg/L"
    },

    {
        id: "esr",
        name: "ESR",
        low: 0,
        high: 20,
        unit: "mm/hr"
    }

];


/* =========================================================
   RANGE CHECK
   ========================================================= */

function checkRange(value, low, high) {

    if (value < low) {
        return "Low";
    }

    if (value > high) {
        return "High";
    }

    return "Good";
}


/* =========================================================
   RESET
   ========================================================= */

function resetSummary() {

    goodCount = 0;

    lowCount = 0;

    highCount = 0;

    warningCount = 0;

    abnormalResults = [];

}


/* =========================================================
   ADD RESULT
   ========================================================= */

function addToSummary(name, result) {

    if (result === "Good") {

        goodCount++;

    }

    else if (result === "Low") {

        lowCount++;

        abnormalResults.push(
            name + " - Low"
        );

    }

    else if (result === "High") {

        highCount++;

        abnormalResults.push(
            name + " - High"
        );

    }

    else if (result === "Warning") {

        warningCount++;

        abnormalResults.push(
            name + " - Warning"
        );

    }

}


/* =========================================================
   SHOW RESULT
   ========================================================= */

function showResult(
    resultId,
    rawValue,
    low,
    high,
    name
) {

    const resultElement =
        document.getElementById(resultId);


    if (rawValue === "") {

        resultElement.textContent =
            "Not Entered";

        resultElement.className =
            "result-box not-found";

        return;

    }


    const value =
        Number(rawValue);


    if (isNaN(value)) {

        resultElement.textContent =
            "Not Entered";

        resultElement.className =
            "result-box not-found";

        return;

    }


    const result =
        checkRange(
            value,
            low,
            high
        );


    resultElement.textContent =
        result;


    resultElement.className =
        "result-box " +
        result.toLowerCase();


    addToSummary(
        name,
        result
    );

}


/* =========================================================
   HbA1c
   ========================================================= */

function showHbA1cResult(rawValue) {

    const element =
        document.getElementById(
            "hba1cResult"
        );


    if (rawValue === "") {

        element.textContent =
            "Not Entered";

        element.className =
            "result-box not-found";

        return;

    }


    const value =
        Number(rawValue);


    if (isNaN(value)) {

        element.textContent =
            "Not Entered";

        element.className =
            "result-box not-found";

        return;

    }


    if (value < 5.7) {

        element.textContent =
            "Good";

        element.className =
            "result-box good";

        goodCount++;

    }

    else if (value < 6.5) {

        element.textContent =
            "Warning";

        element.className =
            "result-box warning";

        warningCount++;

        abnormalResults.push(
            "HbA1c - Warning"
        );

    }

    else {

        element.textContent =
            "High";

        element.className =
            "result-box high";

        highCount++;

        abnormalResults.push(
            "HbA1c - High"
        );

    }

}


/* =========================================================
   SHOW SUMMARY
   ========================================================= */

function showSummary() {

    document.getElementById(
        "goodCount"
    ).textContent =
        goodCount;


    document.getElementById(
        "lowCount"
    ).textContent =
        lowCount;


    document.getElementById(
        "highCount"
    ).textContent =
        highCount;


    document.getElementById(
        "warningCount"
    ).textContent =
        warningCount;


    const list =
        document.getElementById(
            "abnormalList"
        );


    list.innerHTML = "";


    if (abnormalResults.length === 0) {

        const item =
            document.createElement("li");

        item.textContent =
            "No abnormal results.";

        list.appendChild(item);

        return;

    }


    abnormalResults.forEach(
        function(result) {

            const item =
                document.createElement("li");

            item.textContent =
                result;

            list.appendChild(item);

        }
    );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    document.getElementById(
        "dashboardGood"
    ).textContent =
        goodCount;


    document.getElementById(
        "dashboardLow"
    ).textContent =
        lowCount;


    document.getElementById(
        "dashboardHigh"
    ).textContent =
        highCount;


    document.getElementById(
        "dashboardWarning"
    ).textContent =
        warningCount;

}


/* =========================================================
   INPUT VALUE
   ========================================================= */

function getInputValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =========================================================
   OVERALL ASSESSMENT
   ========================================================= */

function generateOverallAssessment() {

    const message =
        document.getElementById(
            "assessmentMessage"
        );


    const category =
        document.getElementById(
            "categoryAssessment"
        );


    const abnormal =
        lowCount +
        highCount +
        warningCount;


    if (
        goodCount === 0 &&
        abnormal === 0
    ) {

        message.textContent =
            "No laboratory values were entered.";

        category.textContent =
            "Enter your test results and analyze them.";

        return;

    }


    if (abnormal === 0) {

        message.textContent =
            "All entered results are within the selected reference ranges.";

        category.textContent =
            "No abnormal result was detected by this educational analyzer.";

        return;

    }


    if (abnormal <= 2) {

        message.textContent =
            "A small number of entered results are outside the selected reference ranges.";

        category.textContent =
            "Review these results using the reference range printed by your laboratory.";

        return;

    }


    message.textContent =
        "Several entered results are outside the selected reference ranges.";

    category.textContent =
        "Multiple abnormal values were detected. The results should be reviewed with a qualified healthcare professional.";

}


/* =========================================================
   LOW CHECK
   ========================================================= */

function hasLowResult(name) {

    return abnormalResults.some(
        function(result) {

            return result ===
                name + " - Low";

        }
    );

}


/* =========================================================
   HIGH CHECK
   ========================================================= */

function hasHighResult(name) {

    return abnormalResults.some(
        function(result) {

            return result ===
                name + " - High";

        }
    );

}


/* =========================================================
   FOOD RECOMMENDATIONS
   ========================================================= */

function generateRecommendations() {

    const list =
        document.getElementById(
            "recommendationList"
        );


    list.innerHTML = "";


    let recommendations = [];


    if (
        hasLowResult("Hemoglobin") ||
        hasLowResult("Ferritin") ||
        hasLowResult("Iron")
    ) {

        recommendations.push(
            "Consider iron-containing foods such as lean meat, beans, lentils and leafy green vegetables."
        );

    }


    if (
        hasLowResult("Vitamin D")
    ) {

        recommendations.push(
            "Consider vitamin D food sources such as fortified foods, eggs and fatty fish."
        );

    }


    if (
        hasLowResult("Vitamin B12")
    ) {

        recommendations.push(
            "Consider vitamin B12 sources such as eggs, dairy, fish or fortified foods."
        );

    }


    if (
        hasLowResult("Folate")
    ) {

        recommendations.push(
            "Include leafy green vegetables, beans, lentils and fortified grains."
        );

    }


    if (
        hasLowResult("Magnesium")
    ) {

        recommendations.push(
            "Consider nuts, seeds, whole grains and leafy green vegetables."
        );

    }


    if (
        hasHighResult("Glucose") ||
        hasHighResult("HbA1c")
    ) {

        recommendations.push(
            "Reduce highly sugary foods and drinks and focus on balanced meals."
        );

    }


    if (
        hasHighResult("Total Cholesterol") ||
        hasHighResult("LDL") ||
        hasHighResult("Triglycerides")
    ) {

        recommendations.push(
            "Focus on vegetables, whole grains, legumes and sources of unsaturated fats."
        );

    }


    if (recommendations.length === 0) {

        recommendations.push(
            "Maintain a balanced diet containing vegetables, fruits, whole grains, protein and healthy fats."
        );

        recommendations.push(
            "Maintain adequate hydration and regular physical activity."
        );

    }


    recommendations.forEach(
        function(recommendation) {

            const item =
                document.createElement("li");

            item.textContent =
                recommendation;

            list.appendChild(item);

        }
    );

}


/* =========================================================
   MEAL PLAN
   ========================================================= */

function generateMealPlan() {

    const content =
        document.getElementById(
            "mealPlanContent"
        );


    content.innerHTML = `

        <div class="meal-item">

            <strong>
                Breakfast
            </strong>

            <p>
                Eggs or yogurt, whole-grain bread,
                fruit and water.
            </p>

        </div>


        <div class="meal-item">

            <strong>
                Lunch
            </strong>

            <p>
                Chicken, fish or legumes with vegetables,
                whole grains and water.
            </p>

        </div>


        <div class="meal-item">

            <strong>
                Dinner
            </strong>

            <p>
                Lean protein, vegetables and a moderate
                portion of whole grains.
            </p>

        </div>

    `;

}


/* =========================================================
   URINE RESULTS
   ========================================================= */

function analyzeUrine() {

    const urineTests = [

        {
            id: "urineProtein",
            name: "Urine Protein"
        },

        {
            id: "urineGlucose",
            name: "Urine Glucose"
        },

        {
            id: "urineBlood",
            name: "Urine Blood"
        },

        {
            id: "urineKetones",
            name: "Urine Ketones"
        }

    ];


    urineTests.forEach(
        function(test) {

            const value =
                document.getElementById(
                    test.id
                ).value;


            if (
                value === "Positive"
            ) {

                warningCount++;

                abnormalResults.push(
                    test.name + " - Positive"
                );

            }

        }
    );

}

/* =========================================================
   SAVE CURRENT TEST TO DATABASE
   ========================================================= */
async function saveCurrentTest() {

    const data = {

        user_id: userId,

        test_date:
            document.getElementById("savedTestDate").value
            || new Date().toLocaleString(),

        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        diet: document.getElementById("diet").value,

        hemoglobin: document.getElementById("hemoglobin").value,
        wbc: document.getElementById("wbc").value,
        rbc: document.getElementById("rbc").value,
        platelets: document.getElementById("platelets").value,
        hematocrit: document.getElementById("hematocrit").value,
        mcv: document.getElementById("mcv").value,
        neutrophils: document.getElementById("neutrophils").value,
        lymphocytes: document.getElementById("lymphocytes").value,

        glucose: document.getElementById("glucose").value,
        hba1c: document.getElementById("hba1c").value,

        total_cholesterol:
            document.getElementById("totalCholesterol").value,

        ldl: document.getElementById("ldl").value,
        hdl: document.getElementById("hdl").value,
        triglycerides:
            document.getElementById("triglycerides").value,

        creatinine:
            document.getElementById("creatinine").value,

        bun: document.getElementById("bun").value,
        egfr: document.getElementById("egfr").value,

        uric_acid:
            document.getElementById("uricAcid").value,

        alt: document.getElementById("alt").value,
        ast: document.getElementById("ast").value,
        alp: document.getElementById("alp").value,

        bilirubin:
            document.getElementById("bilirubin").value,

        albumin:
            document.getElementById("albumin").value,

        total_protein:
            document.getElementById("totalProtein").value,

        tsh: document.getElementById("tsh").value,

        free_t4:
            document.getElementById("freeT4").value,

        vitamin_d:
            document.getElementById("vitaminD").value,

        vitamin_b12:
            document.getElementById("vitaminB12").value,

        folate:
            document.getElementById("folate").value,

        ferritin:
            document.getElementById("ferritin").value,

        iron:
            document.getElementById("iron").value,

        magnesium:
            document.getElementById("magnesium").value,

        calcium:
            document.getElementById("calcium").value,

        phosphorus:
            document.getElementById("phosphorus").value,

        crp:
            document.getElementById("crp").value,

        esr:
            document.getElementById("esr").value,

        urine_protein:
            document.getElementById("urineProtein").value,

        urine_glucose:
            document.getElementById("urineGlucose").value,

        urine_blood:
            document.getElementById("urineBlood").value,

        urine_ketones:
            document.getElementById("urineKetones").value,

        urine_ph:
            document.getElementById("urinePH").value,

        urine_specific_gravity:
            document.getElementById(
                "urineSpecificGravity"
            ).value
    };


    try {

        const response = await fetch(
            "http://localhost:3000/api/tests",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not save test."
            );

        }


        const result =
            await response.json();


        document.getElementById(
            "saveMessage"
        ).textContent =
            "Test saved successfully to the database. ID: "
            + result.id;


        await displaySavedTests();

    }
    catch (error) {

        console.error(error);

        document.getElementById(
            "saveMessage"
        ).textContent =
            "Error: Could not connect to the backend.";

    }

}


/* =========================================================
   DISPLAY SAVED TESTS
   ========================================================= */
/* =========================================================
   DISPLAY SAVED TESTS FROM DATABASE
   ========================================================= */

async function displaySavedTests() {

    const container =
        document.getElementById(
            "savedTestsList"
        );


    try {

const response = await fetch(
    "http://localhost:3000/api/tests?user_id="
    + encodeURIComponent(userId)
);


        if (!response.ok) {

            throw new Error(
                "Could not load saved tests."
            );

        }


        const savedTests =
            await response.json();


        if (
            !Array.isArray(savedTests) ||
            savedTests.length === 0
        ) {

            container.innerHTML =
                "<p>No saved tests yet.</p>";

            return;

        }


        container.innerHTML = "";


        savedTests.forEach(
            function(test, index) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "saved-test";


                div.innerHTML = `

                    <strong>
                        Test ${index + 1}
                    </strong>

                    <p>
                        Date:
                        ${displayValue(test.test_date)}
                    </p>

                    <p>
                        Age:
                        ${displayValue(test.age)}
                    </p>

                    <p>
                        Gender:
                        ${displayValue(test.gender)}
                    </p>

                    <p>
                        Diet:
                        ${displayValue(test.diet)}
                    </p>

                    <p>
                        Hemoglobin:
                        ${displayValue(test.hemoglobin)}
                    </p>

                    <p>
                        Glucose:
                        ${displayValue(test.glucose)}
                    </p>

                    <p>
                        HbA1c:
                        ${displayValue(test.hba1c)}
                    </p>

                    <p>
                        Total Cholesterol:
                        ${displayValue(test.total_cholesterol)}
                    </p>

                    <p>
                        Vitamin D:
                        ${displayValue(test.vitamin_d)}
                    </p>

                    <p>
                        TSH:
                        ${displayValue(test.tsh)}
                    </p>

                `;


                container.appendChild(
                    div
                );

            }
        );

    }

    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Could not load saved tests from the database.</p>";

    }

}

/* =========================================================
   DISPLAY VALUE
   ========================================================= */

function displayValue(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "Not Entered";

    }


    return value;

}

/* =========================================================
   DELETE ALL SAVED TESTS FROM DATABASE
   ========================================================= */

async function deleteSavedTests() {

    const confirmed =
        confirm(
            "Are you sure you want to delete all your saved tests?"
        );

    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            "http://localhost:3000/api/tests?user_id="
            + encodeURIComponent(userId),
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Could not delete saved tests."
            );

        }


        const result =
            await response.json();


        document.getElementById(
            "saveMessage"
        ).textContent =
            result.message;


        await displaySavedTests();

    }
    catch (error) {

        console.error(error);

        document.getElementById(
            "saveMessage"
        ).textContent =
            "Error: Could not delete your tests from the database.";

    }

}

/* =========================================================
   TREND TITLE
   ========================================================= */

function getTrendTitle(name) {

    const test =
        tests.find(
            function(item) {

                return item.id === name;

            }
        );


    if (!test) {

        if (name === "hba1c") {

            return "HbA1c";

        }

        return name;

    }


    return test.name;

}


/* =========================================================
   TREND UNIT
   ========================================================= */

function getTrendUnit(name) {

    const test =
        tests.find(
            function(item) {

                return item.id === name;

            }
        );


    if (!test) {

        if (name === "hba1c") {

            return "%";

        }

        return "";

    }


    return test.unit;

}

/* =========================================================
   GENERATE TREND FROM DATABASE
   ========================================================= */

async function generateSelectedTrend() {

    const selectedTest =
        document.getElementById(
            "trendTest"
        ).value;


    try {

const response = await fetch(
    "http://localhost:3000/api/tests?user_id="
    + encodeURIComponent(userId)
);


        if (!response.ok) {

            throw new Error(
                "Could not load tests from database."
            );

        }


        const savedTests =
            await response.json();


        if (
            !Array.isArray(savedTests) ||
            savedTests.length === 0
        ) {

            alert(
                "Please save at least one test first."
            );

            return;

        }


        const labels = [];

        const values = [];


        savedTests.forEach(
            function(test) {

                const value =
                    parseFloat(
                        test[selectedTest]
                    );


                if (!isNaN(value)) {

                    labels.push(
                        test.test_date
                    );

                    values.push(
                        value
                    );

                }

            }
        );


        if (values.length === 0) {

            alert(
                "No saved values are available for this test."
            );

            return;

        }


        const canvas =
            document.getElementById(
                "trendChart"
            );


        if (trendChart !== null) {

            trendChart.destroy();

        }


        trendChart =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    getTrendTitle(
                                        selectedTest
                                    ),

                                data: values,

                                borderWidth: 3,

                                tension: 0.3,

                                fill: false

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        plugins: {

                            legend: {

                                display: true

                            }

                        },

                        scales: {

                            y: {

                                title: {

                                    display: true,

                                    text:
                                        getTrendUnit(
                                            selectedTest
                                        )

                                }

                            },

                            x: {

                                title: {

                                    display: true,

                                    text:
                                        "Test Date"

                                }

                            }

                        }

                    }

                }
            );

    }

    catch (error) {

        console.error(error);

        alert(
            "Could not load saved tests from the database."
        );

    }

}

/* =========================================================
   ANALYZE ALL RESULTS
   ========================================================= */

function analyzeResults() {

    resetSummary();


    /* ================= NUMERIC TESTS ================= */

    tests.forEach(
        function(test) {

            const rawValue =
                getInputValue(
                    test.id
                );


            showResult(

                test.id + "Result",

                rawValue,

                test.low,

                test.high,

                test.name

            );

        }
    );


    /* ================= HbA1c ================= */

    showHbA1cResult(
        getInputValue("hba1c")
    );


    /* ================= URINE ================= */

    analyzeUrine();


    /* ================= SUMMARY ================= */

    showSummary();


    updateDashboard();


    generateOverallAssessment();


    generateRecommendations();


    generateMealPlan();

}


/* =========================================================
   PAGE LOAD
   ========================================================= */

window.onload = function() {

    displaySavedTests();

};