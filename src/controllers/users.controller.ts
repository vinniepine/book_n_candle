import { Body, Controller, Delete, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { Roles } from '../decorators/auth.decorator';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Roles('admin')
  @Get()
  list(@Query('email') email?: string, @Query('name') name?: string) {
    return this.users.findAll({ email, name });
  }

  @Get('me')
  me(@Req() req: any) {
    return this.users.findById(req.user.id);
  }

  @Get(':id')
  getUser(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin' && req.user.id !== id) return { message: 'Acesso negado' };
    return this.users.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: any) {
    if (req.user.role !== 'admin' && req.user.id !== id) return { message: 'Acesso negado' };
    return this.users.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role !== 'admin' && req.user.id !== id) return { message: 'Acesso negado' };
    this.users.delete(id);
    return { success: true };
  }
}
