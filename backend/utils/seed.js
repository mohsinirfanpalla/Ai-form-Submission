
import bcrypt from "bcryptjs";
import { connectDB, pool, query } from "../config/db.js";
import * as userRepo from "../repositories/user.repo.js";
import * as formRepo from "../repositories/form.repo.js";
import * as responseRepo from "../repositories/response.repo.js";
import { nanoid } from "./nanoid.js";

// -----------------------------
// Helpers
// -----------------------------

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function sample(arr, count) {
    return [...arr]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
    return Math.random() < probability;
}

function weighted(items) {
    const total = items.reduce((sum, item) => sum + item.weight, 0);

    let random = Math.random() * total;

    for (const item of items) {
        random -= item.weight;

        if (random <= 0) {
            return item.value;
        }
    }

    return items[items.length - 1].value;
}

function daysAgoDate(days) {
    const date = new Date();

    date.setDate(date.getDate() - days);

    return date;
}

function opt(value) {
    return value ?? null;
}

function q(type, label, options = []) {
    return {
        id: nanoid(),
        type,
        label,
        options,
        required: false,
    };
}

// -----------------------------
// Demo data
// -----------------------------

const FIRST = [
    "Ali",
    "Ahmed",
    "Umar",
    "John",
    "Emma",
    "Alex",
    "Sarah",
    "Daniel",
    "Aisha",
    "Fatima",
    "Michael",
    "David",
    "Sophia",
    "Olivia",
    "James",
];

const LAST = [
    "Khan",
    "Smith",
    "Johnson",
    "Brown",
    "Williams",
    "Taylor",
    "Wilson",
    "Davis",
    "Miller",
    "Anderson",
    "Thomas",
    "Jackson",
];

const COMMENTS = [
    "Very good experience.",
    "Everything was smooth.",
    "Could be improved.",
    "I really liked it.",
    "The experience was excellent.",
    "It was okay.",
    "Fast and easy to use.",
    "The interface was simple.",
    "I would recommend it.",
    "Needs some improvements.",
];

const CITIES = [
    "Srinagar",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Chandigarh",
    "Jammu",
    "Kolkata",
    "Chennai",
];

const UAS = [
    "Chrome",
    "Firefox",
    "Safari",
    "Edge",
];


// -----------------------------
// Respondent generator
// -----------------------------

function respondent() {
    const firstName = pick(FIRST);
    const lastName = pick(LAST);

    return {
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${rand(
            1,
            999
        )}@example.com`,
        city: pick(CITIES),
        userAgent: pick(UAS),
    };
}


// -----------------------------
// Answer generator
// -----------------------------

function answerFor(question, who) {
    const label = question.label?.toLowerCase() || "";
    const type = question.type;

    // Name
    if (
        label.includes("name") ||
        label.includes("full name")
    ) {
        return who.name;
    }

    // Email
    if (type === "email" || label.includes("email")) {
        return who.email;
    }

    // City
    if (label.includes("city")) {
        return who.city;
    }

    // Rating
    if (type === "rating") {
        return rand(1, 5);
    }

    // Dropdown / select
    if (
        type === "dropdown" ||
        type === "select"
    ) {
        if (question.options?.length) {
            return pick(question.options);
        }
    }

    // Multiple choice
    if (
        type === "multiple_choice" ||
        type === "radio"
    ) {
        if (question.options?.length) {
            return pick(question.options);
        }
    }

    // Checkbox
    if (
        type === "checkbox" ||
        type === "multiple"
    ) {
        if (question.options?.length) {
            return sample(
                question.options,
                Math.min(
                    question.options.length,
                    rand(1, 2)
                )
            );
        }
    }

    // Number
    if (
        type === "number" ||
        label.includes("age")
    ) {
        return rand(18, 55);
    }

    // Yes / No
    if (
        label.includes("recommend") ||
        label.includes("satisfied") ||
        label.includes("agree")
    ) {
        return weighted([
            { value: "Yes", weight: 70 },
            { value: "No", weight: 30 },
        ]);
    }

    // Default text
    return pick(COMMENTS);
}


// -----------------------------
// Static question types
// -----------------------------

const STATIC = new Set([
    "short_text",
    "long_text",
    "email",
    "number",
    "rating",
    "dropdown",
    "multiple_choice",
    "checkbox",
    "date",
]);


// -----------------------------
// Build response
// -----------------------------

function buildResponse(form, dayOffset) {
    const who = respondent();

    const answers = {};

    for (const question of form.questions || []) {
        if (!question.id) {
            question.id = nanoid();
        }

        if (STATIC.has(question.type)) {
            answers[question.id] = answerFor(
                question,
                who
            );
        } else {
            answers[question.id] = answerFor(
                question,
                who
            );
        }
    }

    const submittedAt = daysAgoDate(dayOffset);

    return {
        form: form._id,

        answers,

        respondent: {
            name: who.name,
            email: who.email,
        },

        meta: {
            city: who.city,
            userAgent: who.userAgent,
        },

        submittedAt,
    };
}


// -----------------------------
// Forms
// -----------------------------

const FORMS = [
    {
        title: "Customer Feedback Survey",
        description:
            "Collect customer feedback and improve the product.",
        theme: "modern",
        color: "#0c8b7c",
        status: "published",
        favorite: true,
        responses: 142,
        conversion: 0.42,

        questions: [
            q(
                "short_text",
                "What is your name?"
            ),
            q(
                "email",
                "What is your email?"
            ),
            q(
                "rating",
                "How would you rate your experience?"
            ),
            q(
                "long_text",
                "What did you like most?"
            ),
            q(
                "long_text",
                "What can we improve?"
            ),
        ],
    },

    {
        title: "Employee Satisfaction 2026",
        description:
            "Employee satisfaction and workplace feedback survey.",
        theme: "corporate",
        color: "#2563eb",
        status: "published",
        responses: 88,
        conversion: 0.61,

        questions: [
            q(
                "rating",
                "How satisfied are you with your workplace?"
            ),
            q(
                "dropdown",
                "How would you rate management?",
                [
                    "Excellent",
                    "Good",
                    "Average",
                    "Poor",
                ]
            ),
            q(
                "dropdown",
                "How is your work-life balance?",
                [
                    "Excellent",
                    "Good",
                    "Average",
                    "Poor",
                ]
            ),
            q(
                "long_text",
                "What would you improve?"
            ),
        ],
    },

    {
        title: "Restaurant Feedback",
        description:
            "Collect feedback from restaurant customers.",
        theme: "gradient",
        color: "#f97316",
        status: "published",
        responses: 203,
        conversion: 0.55,

        questions: [
            q(
                "rating",
                "How would you rate the food?"
            ),
            q(
                "rating",
                "How would you rate the service?"
            ),
            q(
                "rating",
                "How would you rate the atmosphere?"
            ),
            q(
                "dropdown",
                "Would you recommend us?",
                ["Yes", "No"]
            ),
            q(
                "long_text",
                "Additional comments"
            ),
        ],
    },

    {
        title: "Restaurant Feedback",
        description:
            "Customer feedback for restaurant services.",
        theme: "modern",
        color: "#ea580c",
        status: "published",
        responses: 203,
        conversion: 0.55,

        questions: [
            q(
                "rating",
                "Rate your overall experience"
            ),
            q(
                "rating",
                "Rate the food quality"
            ),
            q(
                "rating",
                "Rate the staff"
            ),
            q(
                "dropdown",
                "Would you visit again?",
                ["Yes", "No"]
            ),
        ],
    },

    {
        title: "DevConf 2026 Registration",
        description:
            "Registration form for DevConf 2026.",
        theme: "dark",
        color: "#7c3aed",
        status: "published",
        favorite: true,
        responses: 64,
        conversion: 0.48,

        questions: [
            q(
                "short_text",
                "Full Name"
            ),
            q(
                "email",
                "Email Address"
            ),
            q(
                "short_text",
                "Company"
            ),
            q(
                "dropdown",
                "Experience Level",
                [
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                ]
            ),
            q(
                "dropdown",
                "Which track are you interested in?",
                [
                    "Frontend",
                    "Backend",
                    "AI",
                    "DevOps",
                ]
            ),
        ],
    },

    {
        title: "Product Market Research",
        description:
            "Understand customer preferences and product needs.",
        theme: "glassmorphism",
        color: "#0891b2",
        status: "published",
        responses: 117,
        conversion: 0.37,

        questions: [
            q(
                "short_text",
                "What is your name?"
            ),
            q(
                "dropdown",
                "How often do you use similar products?",
                [
                    "Daily",
                    "Weekly",
                    "Monthly",
                    "Rarely",
                ]
            ),
            q(
                "rating",
                "How valuable would this product be?"
            ),
            q(
                "long_text",
                "What features would you like to see?"
            ),
        ],
    },

    {
        title: "Newsletter Signup",
        description:
            "Collect email addresses for newsletter subscribers.",
        theme: "minimal",
        color: "#0c8b7c",
        status: "published",
        responses: 326,
        conversion: 0.7,

        questions: [
            q(
                "short_text",
                "Name"
            ),
            q(
                "email",
                "Email"
            ),
            q(
                "dropdown",
                "Which topics interest you?",
                [
                    "Technology",
                    "Business",
                    "AI",
                    "Programming",
                ]
            ),
        ],
    },

    {
        title: "Frontend Engineer Application",
        description:
            "Application form for frontend engineering candidates.",
        theme: "corporate",
        color: "#2563eb",
        status: "draft",
        responses: 0,

        questions: [
            q(
                "short_text",
                "Full Name"
            ),
            q(
                "email",
                "Email"
            ),
            q(
                "short_text",
                "GitHub Profile"
            ),
            q(
                "short_text",
                "Years of Experience"
            ),
            q(
                "long_text",
                "Tell us about yourself"
            ),
        ],
    },

    {
        title: "Course Evaluation - Intro to React",
        description:
            "Collect feedback from students after the React course.",
        theme: "modern",
        color: "#61dafb",
        status: "draft",
        favorite: true,
        responses: 0,

        questions: [
            q(
                "rating",
                "How would you rate the course?"
            ),
            q(
                "rating",
                "How clear was the instructor?"
            ),
            q(
                "long_text",
                "What did you enjoy most?"
            ),
            q(
                "long_text",
                "What should be improved?"
            ),
        ],
    },

    {
        title: "Q3 Beta Feedback (archived)",
        description:
            "Archived beta product feedback.",
        theme: "minimal",
        color: "#64748b",
        status: "published",
        archived: true,
        responses: 41,
        conversion: 0.5,

        questions: [
            q(
                "rating",
                "How would you rate the beta?"
            ),
            q(
                "dropdown",
                "Would you use this product?",
                ["Yes", "No"]
            ),
            q(
                "long_text",
                "Tell us about your experience"
            ),
        ],
    },
];


// -----------------------------
// Seed database
// -----------------------------

async function seed() {
    await connectDB();

    const email = "alex@timetoprogram.dev";

    // Remove old demo user.
    // Related data should be handled by your database
    // foreign-key rules.
    await query(
        "DELETE FROM users WHERE email = $1",
        [email]
    );

    // Create demo user
    const user = await userRepo.createUser({
        name: "Alex Carter",

        email,

        password: await bcrypt.hash(
            "Test@1234",
            10
        ),

        avatarColor: "#0c8b7c",
    });

    const SPREAD_DAYS = 24;

    let totalResponses = 0;


    // IMPORTANT:
    // Response generation is INSIDE this loop.
    // This fixes:
    // ReferenceError: def is not defined
    for (const def of FORMS) {
        const form = await formRepo.createForm(
            user.id,
            {
                title: def.title,

                description:
                    def.description,

                theme: def.theme,

                status: def.status,

                publishedAt:
                    def.status === "published"
                        ? daysAgoDate(
                              SPREAD_DAYS + 3
                          )
                        : null,

                questions: def.questions,

                settings: {
                    primaryColor:
                        def.color,

                    submitButtonText:
                        "Submit",
                },
            }
        );


        // Favorite / archived
        if (
            def.favorite ||
            def.archived
        ) {
            await formRepo.updateForm(
                form.id,
                {
                    isFavorite:
                        !!def.favorite,

                    isArchived:
                        !!def.archived,
                }
            );
        }


        // -------------------------
        // Generate responses
        // -------------------------

        const n = def.responses || 0;

        if (n > 0) {
            const docs = [];

            for (
                let i = 0;
                i < n;
                i++
            ) {
                const dayOffset =
                    Math.floor(
                        Math.pow(
                            Math.random(),
                            1.7
                        ) *
                            SPREAD_DAYS
                    );

                docs.push(
                    buildResponse(
                        form,
                        dayOffset
                    )
                );
            }


            // Insert responses
            await responseRepo.insertManyResponses(
                docs
            );


            totalResponses += n;


            // Generate fake views
            const views = n
                ? Math.round(
                      n /
                          (def.conversion ||
                              0.5)
                  ) +
                  rand(0, 25)
                : rand(0, 12);


            // Update form counters
            await formRepo.setCounters(
                form.id,
                {
                    views,

                    responseCount: n,
                }
            );


            console.log(
                `✓ ${def.title.padEnd(
                    34
                )} ${def.status.padEnd(
                    9
                )} ${String(
                    n
                ).padStart(
                    4
                )} responses · ${views} views`
            );
        } else {
            console.log(
                `✓ ${def.title.padEnd(
                    34
                )} ${def.status.padEnd(
                    9
                )}    0 responses`
            );
        }
    }


    // -------------------------
    // Finished
    // -------------------------

    console.log(
        "\n✓ Seed complete"
    );

    console.log(
        `${FORMS.length} forms, ${totalResponses} responses`
    );

    console.log(
        "Login - alex@timetoprogram.dev / Test@1234"
    );


    await pool.end();

    process.exit(0);
}


// -----------------------------
// Error handling
// -----------------------------

seed().catch((err) => {
    console.error(err);

    process.exit(1);
});

