"""Builds metadata.json (valid route / airline / stops combos) from the training data."""
import json
import pandas as pd

df = pd.read_excel("Data_Train (1).xlsx").dropna()
df["stops"] = df.Total_Stops.map({"non-stop": 0, "1 stop": 1, "2 stops": 2, "3 stops": 3, "4 stops": 4})
months = sorted(pd.to_datetime(df.Date_of_Journey, format="%d/%m/%Y").dt.month.unique().tolist())
routes = {}
for (s, d, a), g in df.groupby(["Source", "Destination", "Airline"]):
    routes.setdefault(s, {}).setdefault(d, {})[a] = sorted(g.stops.unique().tolist())
json.dump({"months": months, "routes": routes}, open("metadata.json", "w"), indent=1)
print("metadata.json written:", months, {s: list(d) for s, d in routes.items()})
