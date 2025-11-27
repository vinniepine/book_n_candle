import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/auth.decorator';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService.seedAdminPassword(process.env.ADMIN_PASSWORD || 'ChangeMeNow!');
  }

  @Public()
  @Post('register')
  register(@Body() body: RegisterDto) {
    const user = this.authService.register(body.name, body.email, body.password, body.role || 'user');
    return { id: user.id, email: user.email, role: user.role };
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Public()
  @Post('request-password-reset')
  requestReset(@Body('email') email: string) {
    // Stub for password reset flow
    return { message: `Se existia, um e-mail foi enviado para ${email}` };
  }
}
