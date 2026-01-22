import { Controller, Patch, Get, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
        const userId = req.user.id;
        return this.usersService.updateProfile(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/profile')
    async getProfile(@Req() req) {

        const userId = req.user.id;
        return this.usersService.getProfileStats(userId);
        
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getStats(@GetUser() user: { id: string }) {
      return this.usersService.getDashboardStats(user.id);
    }
}