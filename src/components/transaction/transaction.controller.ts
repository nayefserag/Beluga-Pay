import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { TransactionViaPhoneDto, TransactionViaAccountNumberDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ) {}

    @Post('send-money/via-phone')
    async sendMoney(@Body() sendMoney: TransactionViaPhoneDto ) {
        const transaction = await this.transactionService.sendMoney(sendMoney);
        return {
            message: `Transaction From ${sendMoney.sender} To ${sendMoney.receiver}  Done successfully`,
            status: HttpStatus.CREATED,
          };
    }

}
