const express = require("express");
const Database = require("better-sqlite3");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");

    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();

});

// ==============================
// Database
// ==============================

const db = new Database("health_tests.db");


// ==============================
// Create Table
// ==============================
db.prepare(`
    CREATE TABLE IF NOT EXISTS health_tests (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id TEXT,

        test_date TEXT,

        age INTEGER,

        gender TEXT,

        diet TEXT,

        /* CBC */
        hemoglobin REAL,
        wbc REAL,
        rbc REAL,
        platelets REAL,
        hematocrit REAL,
        mcv REAL,
        neutrophils REAL,
        lymphocytes REAL,

        /* Diabetes */
        glucose REAL,
        hba1c REAL,

        /* Lipid Profile */
        total_cholesterol REAL,
        ldl REAL,
        hdl REAL,
        triglycerides REAL,

        /* Kidney */
        creatinine REAL,
        bun REAL,
        egfr REAL,
        uric_acid REAL,

        /* Liver */
        alt REAL,
        ast REAL,
        alp REAL,
        bilirubin REAL,
        albumin REAL,
        total_protein REAL,

        /* Thyroid */
        tsh REAL,
        free_t4 REAL,

        /* Vitamins & Minerals */
        vitamin_d REAL,
        vitamin_b12 REAL,
        folate REAL,
        ferritin REAL,
        iron REAL,
        magnesium REAL,
        calcium REAL,
        phosphorus REAL,

        /* Inflammation */
        crp REAL,
        esr REAL,

        /* Urinalysis */
        urine_protein TEXT,
        urine_glucose TEXT,
        urine_blood TEXT,
        urine_ketones TEXT,
        urine_ph REAL,
        urine_specific_gravity REAL

    )
`).run();

// ==============================
// Add New Columns If Needed
// ==============================

const newColumns = [

    ["user_id", "TEXT"],
    ["wbc", "REAL"],
    ["rbc", "REAL"],
    ["platelets", "REAL"],
    ["hematocrit", "REAL"],
    ["mcv", "REAL"],
    ["neutrophils", "REAL"],
    ["lymphocytes", "REAL"],

    ["ldl", "REAL"],
    ["hdl", "REAL"],
    ["triglycerides", "REAL"],

    ["creatinine", "REAL"],
    ["bun", "REAL"],
    ["egfr", "REAL"],
    ["uric_acid", "REAL"],

    ["alt", "REAL"],
    ["ast", "REAL"],
    ["alp", "REAL"],
    ["bilirubin", "REAL"],
    ["albumin", "REAL"],
    ["total_protein", "REAL"],

    ["free_t4", "REAL"],

    ["vitamin_b12", "REAL"],
    ["folate", "REAL"],
    ["ferritin", "REAL"],
    ["iron", "REAL"],
    ["magnesium", "REAL"],
    ["calcium", "REAL"],
    ["phosphorus", "REAL"],

    ["crp", "REAL"],
    ["esr", "REAL"],

    ["urine_protein", "TEXT"],
    ["urine_glucose", "TEXT"],
    ["urine_blood", "TEXT"],
    ["urine_ketones", "TEXT"],
    ["urine_ph", "REAL"],
    ["urine_specific_gravity", "REAL"]

];


const existingColumns =
    db.prepare(
        "PRAGMA table_info(health_tests)"
    ).all();


newColumns.forEach(
    function(column) {

        const columnName = column[0];
        const columnType = column[1];


        const exists =
            existingColumns.some(
                function(existingColumn) {

                    return existingColumn.name === columnName;

                }
            );


        if (!exists) {

            db.prepare(
                `ALTER TABLE health_tests ADD COLUMN ${columnName} ${columnType}`
            ).run();

        }

    }
);


// ==============================
// Home
// ==============================

app.get("/", function (req, res) {

    res.send("Health Analyzer Backend is Running!");

});

// ==============================
// Save Test
// ==============================
app.post("/api/tests", function(req, res) {

    const data = req.body;

    try {

        const statement = db.prepare(`
            INSERT INTO health_tests (

                user_id,
                test_date,
                age,
                gender,
                diet,

                hemoglobin,
                wbc,
                rbc,
                platelets,
                hematocrit,
                mcv,
                neutrophils,
                lymphocytes,

                glucose,
                hba1c,

                total_cholesterol,
                ldl,
                hdl,
                triglycerides,

                creatinine,
                bun,
                egfr,
                uric_acid,

                alt,
                ast,
                alp,
                bilirubin,
                albumin,
                total_protein,

                tsh,
                free_t4,

                vitamin_d,
                vitamin_b12,
                folate,
                ferritin,
                iron,
                magnesium,
                calcium,
                phosphorus,

                crp,
                esr,

                urine_protein,
                urine_glucose,
                urine_blood,
                urine_ketones,
                urine_ph,
                urine_specific_gravity

            )

            VALUES (

                ?, ?, ?, ?, ?,

                ?, ?, ?, ?, ?, ?, ?, ?,

                ?, ?,

                ?, ?, ?, ?,

                ?, ?, ?, ?,

                ?, ?, ?, ?, ?, ?,

                ?, ?,

                ?, ?, ?, ?, ?, ?, ?, ?,

                ?, ?,

                ?, ?, ?, ?, ?, ?

            )
        `);


        const result = statement.run(

            data.user_id || null,

            data.test_date || null,
            data.age || null,
            data.gender || null,
            data.diet || null,

            data.hemoglobin || null,
            data.wbc || null,
            data.rbc || null,
            data.platelets || null,
            data.hematocrit || null,
            data.mcv || null,
            data.neutrophils || null,
            data.lymphocytes || null,

            data.glucose || null,
            data.hba1c || null,

            data.total_cholesterol || null,
            data.ldl || null,
            data.hdl || null,
            data.triglycerides || null,

            data.creatinine || null,
            data.bun || null,
            data.egfr || null,
            data.uric_acid || null,

            data.alt || null,
            data.ast || null,
            data.alp || null,
            data.bilirubin || null,
            data.albumin || null,
            data.total_protein || null,

            data.tsh || null,
            data.free_t4 || null,

            data.vitamin_d || null,
            data.vitamin_b12 || null,
            data.folate || null,
            data.ferritin || null,
            data.iron || null,
            data.magnesium || null,
            data.calcium || null,
            data.phosphorus || null,

            data.crp || null,
            data.esr || null,

            data.urine_protein || null,
            data.urine_glucose || null,
            data.urine_blood || null,
            data.urine_ketones || null,
            data.urine_ph || null,
            data.urine_specific_gravity || null

        );


        res.json({

            success: true,

            message:
                "Test saved successfully to the database.",

            id: result.lastInsertRowid

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Could not save test to the database."

        });

    }

});

// ==============================
// Get Saved Tests
// ==============================

app.get("/api/tests", function(req, res) {

    const userId = req.query.user_id;

    if (!userId) {

        return res.status(400).json({

            success: false,

            message:
                "User ID is required."

        });

    }

    try {

        const tests = db.prepare(`
            SELECT *
            FROM health_tests
            WHERE user_id = ?
            ORDER BY id ASC
        `).all(userId);


        res.json(tests);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Could not load tests from database."

        });

    }

});


// ==============================
// Delete All Tests
// ==============================

app.delete("/api/tests", function(req, res) {

    const userId = req.query.user_id;

    if (!userId) {

        return res.status(400).json({

            success: false,

            message:
                "User ID is required."

        });

    }

    try {

        const result = db.prepare(`
            DELETE FROM health_tests
            WHERE user_id = ?
        `).run(userId);


        res.json({

            success: true,

            message:
                result.changes +
                " saved test(s) deleted."

        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Could not delete tests from database."

        });

    }

});

// ==============================
// Start Server
// ==============================

app.listen(PORT, function () {

    console.log(
        `Server is running on http://localhost:${PORT}`
    );

});