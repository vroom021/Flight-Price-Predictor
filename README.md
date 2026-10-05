# ✈ Flight Price Predictor

A machine learning web app that estimates Indian domestic airfares.
A Random Forest regressor, trained on the Kaggle flight price dataset, sits behind a
Flask API and a responsive HTML/CSS/JavaScript front end.

## Features
- Predicts fare in ₹ from journey date, airline, source, destination, stops,
  departure time and duration
- Dropdowns only offer route / airline / stops combinations present in the training data
- Shows the computed arrival time as you type
- Warns when the journey month is outside the model's training period
- Light and dark theme support

## Tech stack
Python · pandas · scikit-learn · Flask · HTML · CSS · JavaScript

## ML workflow
Data cleaning → feature engineering (date, time and duration extraction, one-hot
encoding) → feature selection (ExtraTrees importances) → Random Forest training →
hyperparameter tuning → model saved as `flight_rf.pkl`

## Run locally
    pip install -r requirements.txt
    python app.py
Open http://127.0.0.1:5000
