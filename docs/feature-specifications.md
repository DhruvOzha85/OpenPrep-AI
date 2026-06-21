# 📋 Feature Specifications

This document defines the functional specifications and algorithmic details for the core features of **OpenPrep AI**.

---

## 📊 PYQ Intelligence

The PYQ Intelligence engine extracts insights from historical exam papers to help students optimize their preparation.

### 1. Functional Scope
* **Document Processing**: Students upload a PDF of a Previous Year Question Paper (PYQ).
* **Text Extraction**: The backend extracts raw text from the PDF.
* **AI Analysis**: The Gemini API processes the text to identify:
  * **Chapter Weightage**: A percentage breakdown of chapters represented in the exam paper.
  * **Important Topics**: Core concepts rated by importance (`High`, `Medium`, `Low`) and frequency.
  * **Repeated Questions**: Detection of duplicate or highly similar questions across exam years.
  * **Exam Trend Analysis**: Descriptive summaries analyzing emphasis on theory vs. practical problem-solving.

### 2. Prompt Schema & Flow
The backend uses `gemini-1.5-flash` with a strict JSON system prompt to retrieve structured data. The schema must resolve to:
```json
{
  "chapterWeightage": [
    { "chapterName": "string", "weightage": 35 }
  ],
  "importantTopics": [
    { "topicName": "string", "importance": "High", "frequency": 4 }
  ],
  "repeatedQuestions": [
    { "questionText": "string", "years": [2023, 2025] }
  ],
  "trendAnalysis": "string"
}
```

---

## 🎯 AI Weakness Detection

This engine analyzes student assessment history to flag knowledge gaps.

### 1. Diagnostics Workflow
* Every time a student submits a quiz attempt, the backend logs the score, subject, and topic.
* A weakness detection service processes these attempts periodically:
  * If average score for a topic falls below **50%**, status becomes **Weak**.
  * If average score is between **50% and 80%**, status becomes **Medium**.
  * If average score is above **80%**, status becomes **Strong**.
* The Gemini API analyzes this aggregated history to generate study recommendations.

### 2. Recommendations Output Schema
```json
{
  "weakSubjects": ["string"],
  "recommendations": [
    { 
      "subject": "string", 
      "topic": "string", 
      "suggestion": "string", 
      "priority": "High" | "Medium" | "Low" 
    }
  ]
}
```

---

## 📅 Smart Study Planner

Generates realistic, structured study schedules dynamically based on timeline constraints.

### 1. Inputs
* **Exam Target**: Selected Exam & Syllabus.
* **Date Range**: Start date and target exam end date.
* **Capacity**: Daily study hour availability (default is 3 hours).

### 2. Scheduling Algorithm
* Calculates the total days available between `startDate` and `endDate`.
* Distributes syllabus topics across available study days, scheduling longer study blocks for complex topics.
* Reserves **15-20%** of the scheduled timeline at the end for mock assessments and overall revision.
* Allocates daily revision tasks to reinforce previously covered topics.

---

## 🧠 AI Quiz Generator

Creates practice quizzes from user uploads or database subjects.

### 1. Requirements
* Each quiz contains a customizable count of questions (default is 5).
* Questions are returned as 4-option MCQs.
* A detailed explanation must accompany the correct option to help students learn.

---

## 🗂️ Flashcards & Spaced Repetition (SM-2)

Implements spaced repetition using the SuperMemo SM-2 algorithm to optimize memorization.

### 1. SM-2 Variables
* **Repetitions ($n$)**: Number of consecutive times the card was successfully recalled.
* **Ease Factor ($EF$)**: Difficulty multiplier (starts at 2.5).
* **Interval ($I$)**: Days to wait before the next review.

### 2. Interval Calculation
* For $n = 1$: $I = 1$ day.
* For $n = 2$: $I = 6$ days.
* For $n > 2$: $I = I_{prev} \times EF$ days.

### 3. Response Quality ($q$)
After reviewing a card, the student rates their recall quality on a 0-5 scale:
* `5`: Perfect response.
* `4`: Correct response after a hesitation.
* `3`: Correct response recalled with serious difficulty.
* `2`: Incorrect response; where the correct one seemed easy to recall.
* `1`: Incorrect response; the correct one was remembered upon display.
* `0`: Complete blackout.

### 4. Updating Ease Factor ($EF$)
After every review, the Ease Factor is recalculated:
$$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
If $EF' < 1.3$, $EF$ is set to $1.3$ (minimum limit).
If response quality $q < 3$, repetitions is reset to $0$, and interval $I$ is reset to $1$ day.

---

## 📊 Dashboard Analytics

Provides students with an overview of their learning telemetry:
* **Streak Tracking**: Logs consecutive active days. If last active date is $> 1$ day, the streak resets to 0.
* **Hours Studied**: Aggregates time spent on completed study plan tasks.
* **Completion Rate**: Percentage of overall syllabus topics categorized as "Strong".
* **Recent Activity Feed**: Chronological list of completed quizzes, uploaded PYQs, and flashcard reviews.
