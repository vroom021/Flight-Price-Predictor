from flask import Flask, jsonify, render_template, request

import predictor

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/options")
def options():
    return jsonify(predictor.META)


@app.post("/api/predict")
def predict():
    try:
        return jsonify(predictor.predict(request.get_json(silent=True) or {}))
    except predictor.InputError as e:
        return jsonify(error=str(e)), 400


if __name__ == "__main__":
    app.run(debug=True)
