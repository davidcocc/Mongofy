import pandas as pd

df = pd.read_csv("normalizedMusicData.csv")



columns_to_drop = ["Playlist", "key", "mode", "liveness", "index", "Unnamed: 0", "acousticness", "loudness", "time_signature", "analysis_url", "track_href", "tempo", "uri"]
df = df.drop(columns=columns_to_drop)
col_id = df.pop('id')
df.insert(0, '_id', col_id)
df.to_csv("musicData.csv", index=False)

