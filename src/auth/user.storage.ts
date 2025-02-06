import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface StoredUser {
  id: string;
  username: string;
  discriminator?: string;
  avatar: string;
  global_name?: string;
}

@Injectable()
export class UserStorage {
  private storagePath: string;
  private readonly logger = new Logger(UserStorage.name);

  constructor() {
    this.storagePath = path.join(process.cwd(), 'users.json');
    this.initStorage();
  }

  private initStorage() {
    try {
      if (!fs.existsSync(this.storagePath)) {
        fs.writeFileSync(this.storagePath, JSON.stringify({}));
      } else {
        // Vérifie si le fichier est lisible et valide
        const content = fs.readFileSync(this.storagePath, 'utf-8');
        try {
          JSON.parse(content);
        } catch (e) {
          this.logger.warn('Invalid JSON file found, resetting storage');
          fs.writeFileSync(this.storagePath, JSON.stringify({}));
        }
      }
    } catch (error) {
      this.logger.error('Error initializing storage:', error);
      throw error;
    }
  }

  private readStorage(): Record<string, StoredUser> {
    try {
      const content = fs.readFileSync(this.storagePath, 'utf-8');
      if (!content || content.trim() === '') {
        return {};
      }
      return JSON.parse(content);
    } catch (error) {
      this.logger.error('Error reading storage:', error);
      return {};
    }
  }

  private writeStorage(data: Record<string, StoredUser>) {
    try {
      fs.writeFileSync(this.storagePath, JSON.stringify(data, null, 2));
    } catch (error) {
      this.logger.error('Error writing storage:', error);
      throw error;
    }
  }

  saveUser(user: StoredUser) {
    if (!user || !user.id) {
      this.logger.warn('Attempted to save invalid user:', user);
      return;
    }

    const users = this.readStorage();
    users[user.id] = user;
    this.writeStorage(users);
  }

  getUser(userId: string): StoredUser | null {
    if (!userId) {
      this.logger.warn('Attempted to get user with invalid ID');
      return null;
    }

    const users = this.readStorage();
    return users[userId] || null;
  }

  getAllUsers(): StoredUser[] {
    const users = this.readStorage();
    return Object.values(users);
  }
} 