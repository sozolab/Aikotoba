# Aikotoba

学会イベントなどで、参加者同士が合言葉で仲良くなれるアプリ

An app for participants at academic events to become friends through shared passphrases.

## Features

- **プロフィール登録**: 名前・所属・興味（発表タイトル等）・見た目の特徴・合言葉を登録
- **興味マッチング**: 興味が近い人をTop N人表示（異所属を優先）
- **近接通知**: GPS位置情報で近くにいる類似者を通知
- **双方向合言葉マッチ**: お互いの合言葉を入力し、両方正解でマッチ成立

## Tech Stack

- HTML + vanilla JavaScript (no frameworks)
- Firebase Firestore (real-time database)
- Geolocation API (proximity detection)

## Setup

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Firestore Database を有効化
3. アプリを開き、Firebase の API Key / Project ID を入力して接続

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    match /match_requests/{requestId} {
      allow read, write: if true;
    }
    match /matches/{matchId} {
      allow read, write: if true;
    }
  }
}
```

## Getting Started

`index.html` をブラウザで開くか、任意の静的ホスティングにデプロイしてください。
