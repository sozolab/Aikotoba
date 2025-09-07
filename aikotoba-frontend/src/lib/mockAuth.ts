interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

class MockAuth {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
      throw new Error('パスワードは6文字以上である必要があります');
    }

    const user: MockUser = {
      uid: 'mock-user-' + Date.now(),
      email,
      displayName: email.split('@')[0]
    };

    this.currentUser = user;
    this.notifyListeners();
    return { user };
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password.length < 6) {
      throw new Error('パスワードは6文字以上である必要があります');
    }

    const user: MockUser = {
      uid: 'mock-user-' + Date.now(),
      email,
      displayName: email.split('@')[0]
    };

    this.currentUser = user;
    this.notifyListeners();
    return { user };
  }

  async updateProfile(profile: { displayName?: string }) {
    if (this.currentUser && profile.displayName) {
      this.currentUser.displayName = profile.displayName;
      this.notifyListeners();
    }
  }

  async signOut() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }
}

export const mockAuth = new MockAuth();
