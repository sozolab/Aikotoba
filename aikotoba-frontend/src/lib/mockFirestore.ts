interface MockDoc {
  id: string;
  data: any;
  createdAt: Date;
}

class MockFirestore {
  private collections: { [key: string]: MockDoc[] } = {
    passphrases: [],
    events: [
      {
        id: 'event-1',
        data: {
          name: '第45回日本情報処理学会全国大会',
          description: 'AI・機械学習の最新研究発表と交流',
          startDate: new Date('2024-09-15'),
          endDate: new Date('2024-09-17'),
          location: '東京国際フォーラム',
          participants: ['user1', 'user2', 'user3'],
          isActive: true
        },
        createdAt: new Date()
      },
      {
        id: 'event-2',
        data: {
          name: 'データサイエンス研究会',
          description: 'データ分析手法の実践的ワークショップ',
          startDate: new Date('2024-09-20'),
          endDate: new Date('2024-09-21'),
          location: '京都大学',
          participants: ['user1', 'user4', 'user5'],
          isActive: true
        },
        createdAt: new Date()
      }
    ],
    matches: []
  };

  collection(name: string) {
    return {
      add: (data: any) => this.addDoc(name, data),
      where: () => this,
      orderBy: () => this,
      limit: () => this,
      onSnapshot: (callback: (snapshot: any) => void) => {
        const docs = this.collections[name] || [];
        const snapshot = {
          docs: docs.map(doc => ({
            id: doc.id,
            data: () => ({ ...doc.data, createdAt: doc.createdAt })
          })),
          empty: docs.length === 0
        };
        callback(snapshot);
        return () => {};
      }
    };
  }

  private addDoc(collectionName: string, data: any) {
    const doc: MockDoc = {
      id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      data: { ...data },
      createdAt: new Date()
    };

    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }

    this.collections[collectionName].push(doc);
    return Promise.resolve({ id: doc.id });
  }
}

export const mockDb = new MockFirestore();
