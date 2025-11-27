import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DataStoreService } from './data-store.service';
import { SupportMessage } from '../models/entities';

@Injectable()
export class SupportService {
  constructor(private readonly db: DataStoreService) {}

  submit(userId: string, subject: string, content: string) {
    const now = new Date().toISOString();
    const message: SupportMessage = {
      id: uuid(),
      userId,
      subject,
      content,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.db.messages.push(message);
    this.db.log('support_message_created', userId, { messageId: message.id });
    return message;
  }

  list(role: string, requesterId: string) {
    if (role === 'admin' || role === 'operator') return this.db.messages;
    return this.db.messages.filter((m) => m.userId === requesterId);
  }

  respond(messageId: string, responderId: string, content: string) {
    const message = this.db.messages.find((m) => m.id === messageId);
    if (!message) throw new NotFoundException('Mensagem não encontrada');
    message.status = 'responded';
    message.updatedAt = new Date().toISOString();
    this.db.log('support_message_responded', responderId, { messageId, content });
    return message;
  }

  assign(messageId: string, operatorId: string) {
    const message = this.db.messages.find((m) => m.id === messageId);
    if (!message) throw new NotFoundException('Mensagem não encontrada');
    message.assignedTo = operatorId;
    message.status = 'in_review';
    message.updatedAt = new Date().toISOString();
    this.db.log('support_message_assigned', operatorId, { messageId });
    return message;
  }

  delete(messageId: string, requesterRole: string, requesterId: string) {
    const index = this.db.messages.findIndex((m) => m.id === messageId);
    if (index === -1) throw new NotFoundException('Mensagem não encontrada');
    if (requesterRole === 'user' && this.db.messages[index].userId !== requesterId) {
      throw new ForbiddenException('Ação não permitida');
    }
    this.db.messages.splice(index, 1);
    this.db.log('support_message_deleted', requesterId, { messageId });
  }
}
