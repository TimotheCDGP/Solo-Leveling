import { Controller, UseGuards, Get } from "@nestjs/common";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { JwtAuthGuard } from "src/auth/strategies/jwt-auth.guard";
import { UsersService } from "./users.service";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('stats')
  getStats(@GetUser() user: { id: string }) {
    return this.userService.getDashboardStats(user.id);
  }
}