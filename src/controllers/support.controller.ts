import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AssignMessageDto, SupportMessageDto, SupportResponseDto } from '../dto/support.dto';
import { Roles } from '../decorators/auth.decorator';
import { SupportService } from '../services/support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly support: SupportService) {}

  @Get('messages')
  listMessages(@Req() req: any) {
    return this.support.list(req.user.role, req.user.id);
  }

  @Post('messages')
  createMessage(@Req() req: any, @Body() body: SupportMessageDto) {
    return this.support.submit(req.user.id, body.subject, body.content);
  }

  @Roles('admin', 'operator')
  @Patch('messages/:id/respond')
  respond(@Param('id') id: string, @Req() req: any, @Body() body: SupportResponseDto) {
    return this.support.respond(id, req.user.id, body.content);
  }

  @Roles('admin', 'operator')
  @Patch('messages/:id/assign')
  assign(@Param('id') id: string, @Body() body: AssignMessageDto) {
    return this.support.assign(id, body.operatorId);
  }

  @Delete('messages/:id')
  delete(@Param('id') id: string, @Req() req: any) {
    this.support.delete(id, req.user.role, req.user.id);
    return { success: true };
  }
}
